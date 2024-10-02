import "@stdlib/deploy";

contract Puzzle with Deployable {
    pc: Int as uint32;
    solved: Bool;
    a: Int as uint32;
    b: Int as uint32;
    c: Int as uint32;
    d: Int as uint32;
    e: Int as uint32;
    f: Int as uint32;
    tt: Int as uint32;
    pp: Int as uint32;


    init(ctf: Int) {
        self.solved = false;
        self.tt = 0;
        self.pp = 0;
        self.pc = 0;
        self.a = 100;
        self.b = 100;
        self.c = 100;
        self.d = 100;
        self.e = 100;
        self.f = 100;
    }

    receive("Opeorate1") {
        self.a -= 3;
        self.b << 1;
        self.c >> 2;
        self.d += 4;
        self.e << 1;
        self.f -= 3;
        self.pc += 1;
    } // +4

    receive("Opeorate2") {
        self.a += 3;
        self.b >> 1;
        self.c += 1;
        self.d >> 2;
        self.e << 1;
        self.f << 2;
        self.pc += 1;
    } // +4

    receive("Opeorate3") {
        self.a << 2;
        self.b -= 2;
        self.c >> 1;
        self.d += 3;
        self.e << 2;
        self.f >> 2;
        self.pc += 1;
    } // +1

    receive("Opeorate4") {
        self.a += 5;
        self.b >> 2;
        self.c -= 1;
        self.d += 4;
        self.e << 1;
        self.f += 1; 
    } // +9
    
    receive("Opeorate5") {
        self.a -= 4;
        self.b << 2;
        self.c += 2;
        self.d -= 5;
        self.e >> 1;
        self.f += 3;
        self.pc += 1;
    } // -4

    receive("Opeorate6") {
        self.a << 1;
        self.b += 6;
        self.c << 3;
        self.d -= 2;
        self.e += 4;
        self.f >> 3;
        self.pc += 1;
    } // +8

    receive("Opeorate7") {
        self.a -= 1;
        self.b >> 3;
        self.c << 2;
        self.d += 1;
        self.e -= 5;
        self.f += 2;
    } // -3


    receive("Check") {
        if (self.a + self.b + self.c +self.d+self.e+self.f == 638) && (self.pc <= 13) {
            self.solved = true;
        }
    } // should move to is_solved

    get fun is_solved():Bool {
        dump(self.a);
        dump(self.b);
        dump(self.c);
        dump(self.e);
        dump(self.f);
        dump(self.a + self.b + self.c + self.d + self.e + self.f);
        return self.solved;
    }

}

