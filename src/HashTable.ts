


export default class HashTable<K, V> extends Object{

    private size: number;
    private DEFAULT_CAPACITY: number = 16;

    private values : MapEntry<K, V>[] = new MapEntry[];
    //private MapEntry<K, V>[] values = new Map([DEFAULT_CAPACITY]);

    get(key: K): V {

    for (let i = 0; i < this.size; i++) {

    if (values[i] != null) {

    if (values[i].getKey().equals(key)) {
    return values[i].getValue();
                }

            }

        }

    return null
    }


public put(key: K, value: V): void {

    let insert = true

    for (let i = 0; i < size; i++) {

        if (values[i].getKey().equals(key)) {
            values[i].setValue(value);
            insert = false;
        }

    }

    if (insert) {
        ensureCapa();
        values[size++] = new MapEntry<K, V>(key, value);
    }

}

    containsKey(key: K): boolean {

    for (let i = 0; i < size; i++) {

        if (values[i].getKey().equals(key)) {
            return true;
        }

    }

    return false;

}

    isEmpty():boolean {
    return size == 0;
    }

    private ensureCapa(): void {

    if (size == values.length) {
        let newSize = values.length * 2;
        values = Arrays.copyOf(values, newSize);
    }

}

    Mapsize(): number {
    return this.size;
}

    remove(key: K):void {

    for (let i = 0; i < size; i++) {
        if (values[i].getKey().equals(key)) {
            values[i] = null;
            size--;
            condenseArray(i);
        }
    }

}

private condenseArray(start: number):void {

    for (let i = start; i < size; i++) {
        values[i] = values[i + 1];
    }

}

    Set<K> keySet() {

    Set<K> set = new HashSet<K>();

    for (int i = 0; i < size; i++) {
        set.add(values[i].getKey());
    }

    return set;

}

   clear(): void   {
    values = new MapEntry[DEFAULT_CAPACITY];
}

    toString(): string {

    if(this.size == 0){
        return "hsmp{"+this.hashCode()+"}";
    }


    StringBuilder sb = new StringBuilder();
    sb.append('{');

    for(let i = 0; i < this.size; i++){

        sb.append(values[i].getKey());
        sb.append('=');
        sb.append(values[i].getValue());
        if(i != this.size-1)sb.append(',').append(' ');

    }

    return sb.append('}').toString();

}

}

class MapEntry<K, V> {

    private readonly key: K;
    private value: V;

    //constructor(private capacity: number = Infinity) {}

    constructor(key: K, value:V) {
    this.key = key;
    this.value = value;
}

getKey(): K {
    return this.key;
}

getValue(): V {
    return this.value;
}

setValue(value: V): void {
    this.value = value;
}

}
