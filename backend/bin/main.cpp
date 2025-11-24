#include <iostream>
#include <fstream>
#include <string>
using namespace std;

int main() {
    string archivo;
    string patron;

    // Leer líneas completas desde stdin
    if (!getline(cin, archivo)) return 0;
    if (!getline(cin, patron)) return 0;

    ifstream file(archivo);

    if(!file.is_open()){
        cerr<<"No se pudo abrir el archivo: "<<archivo<<endl;
        return 1;
    }

    //cout << "Patron recibido: " << patron << endl;
    cout << R"({"coincidencias":[]})";

    return 0;
}
