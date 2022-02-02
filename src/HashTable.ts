export default class HashTable<K, V> {

    size:number=0;
    //private DEFAULT_CAPACITY: number = 16;

    //private values : MapEntry<K, V> = new MapEntry[this.DEFAULT_CAPACITY];

    private values: MapEntry<K, V>[] = [];


    constructor() {}

    get(key: K): V | null {

    for (let i = 0; i <= this.size; i++) {

    if ((this.values)[i] != null) {

    if ((this.values)[i].equal(key)) {
    return (this.values)[i].getValue();
                }
            }
        }
    return null
    }



    push(key: K, value: V): void {

    let insert = true

    for (let i = 0; i <= this.size; i++) {
        if (this.values[i]!=undefined) {
            if ((this.values)[i].equal(key)) {
                (this.values)[i].setValue(value);
                insert = false;
            }
        }

    }
    if (insert) {
       // this.ensureCapa();
        this.size++;
       this.values.push(new MapEntry(key, value));
    }

}


 //ensureCapa():void {
 //if (this.size == this.values.length-1) {

   //    let newSize = this.values.length * 2;
     //this.values = Object.assign(this.values, newSize);
 //}

//}


    containsKey(key: K): boolean {

    for (let i = 0; i < this.size; i++) {

        if ((this.values)[i].equal(key)) {
            return true;
        }

    }

    return false;

}

   isEmpty():boolean {
        return this.size == 0;
   }


    showsize(): number {
    return this.size;
}

 remove(key: K):void {

     for (let i = 0; i < this.size; i++) {
         if ((this.values)[i]!=undefined) {
         if ((this.values)[i].getKey()== key) {
             this.values[i].delete();
             this.size--;
             //this.condenseArray(i);
            }
        }
     }
 }

private condenseArray(start: number):void {

    for (let i = start; i < this.size; i++) {
        if ((this.values)[i] != undefined) {
            (this.values)[i] = (this.values)[i + 1];
        }
    }

}

    clear(): void
    {   this.size = 0;
        this.values = [];
    }

    print():void {
        console.log(this.values)
    }


}

class MapEntry<K, V>  {

    private readonly key: K;
    private value: V | null;
    //constructor(private capacity: number = Infinity) {}

    constructor(key: K, value:V) {
    this.key = key;
    this.value = value;
}

getKey(): K {
    return this.key;
}

delete():void {
        this.value = null;
}

getValue(): V | null {
    return this.value;
}

setValue(value: V): void {
    this.value = value;
}

equal(key:K): boolean{
        if (key!= undefined) {
            if (key == this.key) {
                return true
            }
        }
    return false
    }

}
