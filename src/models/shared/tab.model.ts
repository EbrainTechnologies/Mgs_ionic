export class TabModel {
    index: number;
    page: string;
    indexStr: string;
    disabled: boolean;

    constructor(index: number, page: string) {
        this.index = index;
        this.page = page;
        this.indexStr = ""+ this.index;
        this.disabled = true;
    }
}