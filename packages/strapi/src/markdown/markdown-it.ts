import { MARK_DOWN_CONFIG } from "./markdown.config";
import urlReplacer from '../sanitizers/url-replacer.sanitizer'
import { ALT, EQUALTO, EQUALTO_SPACE, HTTPS, LAZY, LOADING, PIPE, SPACE, SRC, TITLE } from "../const/app.const";
import { defaultContainer } from "../const/core.const";
export const MarkdownIt = require('markdown-it')(MARK_DOWN_CONFIG);
const imageDefaultRender = MarkdownIt.renderer.rules.image;
const linkDefaultRender = MarkdownIt.renderer.rules.link_open;
console.log(MarkdownIt.renderer.rules)
MarkdownIt.renderer.rules.image = function (tokens, idx, options, env, self) {
    try {
        const imageCdn = defaultContainer.moduleOptions.media.cdnUri;
        const token = tokens[idx];
        token.attrs.push([LOADING, LAZY]);
        let titleText = '';
        let atributeNode = [];
        let jObject = {};

        token.attrs.forEach(t => {
            switch (t[0]) {
                case SRC:
                    if (t[1].indexOf(HTTPS) !== -1) {
                        t[1] = urlReplacer(t[1]);
                    } else {
                        t[1] = imageCdn + t[1];
                    }
                    break;
                case TITLE:
                    titleText = t[1];
                    let splitText = titleText.split(/{{(.*?)}}/);
                    splitText.forEach(t => {
                        if (t) {
                            if (t.indexOf(EQUALTO) !== -1) {
                                t = t.replace(EQUALTO_SPACE, EQUALTO).trim();
                                let splitSpace = t.split(SPACE);

                                splitSpace.forEach(x => {
                                    let splitEqual = x.split(EQUALTO);
                                    jObject[splitEqual[0]] = splitEqual[1];
                                })
                            }
                        }
                    })
                    token.content = splitText[splitText.length - 1].trim();
                    splitText = token.content.split(PIPE);

                    t[1] = splitText[0];
                    if (token.children && token.children.length > 0) {

                        token.children[0].content = splitText[1];
                    }

                    if (atributeNode.length > 0) {
                        atributeNode[1] = splitText[1];
                    }
                    break;
                case ALT:
                    atributeNode = t;
                    break;
            }
        });
        Object.keys(jObject).forEach(t => {
            token.attrs.push([t, jObject[t]]);
        })

    } catch (e) { }

    return imageDefaultRender(tokens, idx, options, env, self);
};

//MarkdownIt.renderer.rules.link_open = function (tokens, idx, options, env, self) {
//    const config = attributeBinding(tokens[idx])
//    if (config.length > 0) {
//        config.forEach(t => {
//            tokens[idx].attrs.push(t);
//        })
//    }
//    return linkDefaultRender(tokens, idx, options, env, self);
//}
function attributeBinding(link) {
    const href = link.attrs[link.attrIndex('href')][1];
    let tokens = [];
    if (href.indexOf("https://") !== -1) {
        tokens.push(['target', '_blank']);
        tokens.push(['rel', 'noopener']);
    } else
        tokens.push(['class', "nuxt-anchore"]);
    return tokens;
}



