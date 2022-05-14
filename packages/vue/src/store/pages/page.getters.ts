
export default {
    getActivePage(state:any) {
        let pages = state.pages;
        return pages[state.activePageUrl] || [];
    },

    getActiveMasterPage(state:any){
        let page = state.pages[state.activePageUrl];
        return page? state.masterPages[page.masterPage] : undefined
    },

    activePageUrl(state:any){
        return state.activePageUrl;
    },

    activeMasterPageName(state:any){
        let pages = state.pages;
        return pages[state.activePageUrl]?.masterPage;
    },

    maxComponentsCount:(state:any)=>(slotName:string,slotCategory:string)=>{
        if(slotCategory === "master"){
            let page = state.pages[state.activePageUrl];
            let masterPage = state.masterPages[page.masterPage];
            return  masterPage?.slots[slotName]?.length    
        }
        let page = state.pages[state.activePageUrl];
        return  page?.slots[slotName]?.length 
    },

    slotComponents:(state:any) => (slotName:string,slotCategory:string) => {
        if(slotCategory === "master"){
            let page = state.pages[state.activePageUrl];
            let masterPage = state.masterPageSlots[page.masterPage];   
            return masterPage && masterPage[slotName] ? masterPage[slotName]  : [];
        }
        let page = state.pageSlots[state.activePageUrl];
        return page && page[slotName] ? page[slotName]  : [];
    }
}