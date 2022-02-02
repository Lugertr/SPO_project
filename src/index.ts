import Lexer from "./Lexer";
import Parser from "./Parser";
import HashTable from "./HashTable";
import StackMachine from "./StackMachine";


let info = (<HTMLSpanElement>document.getElementById('info'));
info.innerText = `Объявление переменной:\n"Название переменной" = "Значение";\na = 5;\nПеременные должны быть написаны английскими буквами, и могут быть любого регистра.\nЧисла должны быть в диапазоне number в javascript.
Скобки могут быть только круглые () и в них должно быть какое-либо условие.
Для вывода используется print

Операции: 
    Логические операции ( > => < <= == != )
    Оператор присвоения ( = )
    Математические операции ( + - / *)

Операторы:
    if будет if
    else будет else 
    else if будет another 
    while будет while

Все блоки начинаются с : и заканчиваться END;
a = 5;
if (a<10):
    print a;
END;

Коллекция Map создаются следующем образом:
a = new HashMap();
Поддерживаются следующие операции:
Добавление - put(a,key,value)
Получения значения по ключу - get(a,key)
Удаление элемента по ключу - remove(a,key)
Размер коллекции - size(a)
Очистка коллекции - clear(a)
`; 

let exInfo = [`operation = 5;
operation = operation + 10 / 2 * 7 - 12 * 2 / 3;
print operation;`,`a = 5;
if (a<10):
    print a;
    a = a + 5;
    if (a>10):
        print a;
        a = a - 2;
        if (a > 2):
        print a;
        END;
    END;
END;
print a;`,`if (6>5):
print 2;
END;
another (6<8):
print 2;
if (4==2):
    print 4;
    END;
else:
    print 4;
    END;
END;
`,
`a = 1;
while (a<8):
    print a;
    a = a + 1;
END;
print a;
`,
`a = 1;
b = 2;
print (((((a+a)))*b+b/b*b/b)+a);`,
`a = new HashMap();
print a;`,
`a = new HashMap();
put(a,b,5);
print a;`,
`a = new HashMap();
put(a,b,5);
put(a,bb,21);
print get(a,b);`,
`a = new HashMap();
put (a,bb,2);
put (a,bbb,5);
print a;
remove (a,bb);
print a;`,
`a = new HashMap();
put (a,bb,2);
put (a,bbb,5);
put (a,sss,0);
print size(a);`,
`a = new HashMap();
put (a,bb,2);
put (a,bbb,5);
print a;
clear(a);
print a;`
];

const exbtn:any = document.getElementsByClassName("btnExm");
for (let i=0;i < exbtn.length;i++) {
    exbtn[i].addEventListener('click',()=> 
    (<HTMLTextAreaElement>document.getElementById('in')).value = exInfo[i])
}

const btn = document.getElementById('comp');
btn.addEventListener("click",()=>{
    let code = (<HTMLTextAreaElement>document.getElementById('in')).value;

let lexer = new Lexer(code); //создание лексера
lexer.lexAnalysis()          //разборка кода на токены

let parser = new Parser(lexer.tokenList); //Создание парсера
let rootNode = parser.parseCode();        //Парсинг кода, распределение токенов по дереву,
                                          //Их запись в стек и обработка

let runCode = new StackMachine();
runCode.run(rootNode);                           //Выполнение кода

})

const btnclr = document.getElementById("clr");

btnclr.addEventListener("click",()=>((<HTMLTextAreaElement>document.getElementById('out')).value = ""))

function Errorshow(e) {
    console.log(e);
    (<HTMLTextAreaElement>document.getElementById('out')).value += e + "\n"; 
}

window.onerror = Errorshow;