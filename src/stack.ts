

export default class stack<tokenTypesList> {    //стек для операций при создании полиз

    private storage: tokenTypesList[] = [];

    constructor(private capacity: number = Infinity) {}

    push(item: tokenTypesList): void {
        if (this.size() === this.capacity) {
            throw Error("Стек переполнен");
        }
        this.storage.push(item);
    }

    pop(): tokenTypesList | undefined {
        return this.storage.pop();
    }

    peek(): tokenTypesList  {
        return this.storage[this.size() - 1];
    }

    size(): number {
        return this.storage.length;
    }

}