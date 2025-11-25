#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <string_view>
#include "json.hpp"

using json = nlohmann::json;
using std::string;
using std::string_view;
using std::vector;

// ----------------- Modelo -----------------
struct Suspect {
    string name;
    string dna;
};

// JSON <-> struct
void to_json(json& j, const Suspect& s) {
    j = json{{"name", s.name}, {"dna", s.dna}};
}

void from_json(const json& j, Suspect& s) {
    j.at("name").get_to(s.name);
    j.at("dna").get_to(s.dna);
}

// ----------------- KMP helpers -----------------
static vector<int> buildLps(string_view pat) {
    vector<int> lps(pat.size(), 0);
    int len = 0;
    for (size_t i = 1; i < pat.size();) {
        if (pat[i] == pat[len]) {
            lps[i++] = ++len;
        } else if (len != 0) {
            len = lps[len - 1];
        } else {
            lps[i++] = 0;
        }
    }
    return lps;
}

// Devuelve true si pat aparece en txt (al menos una vez)
static bool kmpContains(string_view txt, string_view pat, const vector<int>& lps) {
    if (pat.empty()) return true;  // patrón vacío matchea todo
    if (txt.empty()) return false;

    size_t i = 0, j = 0;
    while (i < txt.size()) {
        if (txt[i] == pat[j]) {
            ++i;
            ++j;
            if (j == pat.size()) return true; // primera ocurrencia encontrada
        } else if (j != 0) {
            j = lps[j - 1];
        } else {
            ++i;
        }
    }
    return false;
}

// ----------------- Helpers CSV -----------------

static string trim(const string& s) {
    size_t start = s.find_first_not_of(" \t\r\n");
    if (start == string::npos) return "";
    size_t end = s.find_last_not_of(" \t\r\n");
    return s.substr(start, end - start + 1);
}

// Carga un CSV simple con formato: name,dna
static bool loadSuspectsFromCsv(const string& path, vector<Suspect>& suspects, string& error) {
    std::ifstream file(path);
    if (!file.is_open()) {
        error = "No se pudo abrir el archivo CSV: " + path;
        return false;
    }

    string line;
    while (std::getline(file, line)) {
        line = trim(line);
        if (line.empty()) continue;

        size_t commaPos = line.find(',');
        if (commaPos == string::npos) {
            error = "Línea CSV sin coma: " + line;
            return false;
        }

        string name = trim(line.substr(0, commaPos));
        string dna  = trim(line.substr(commaPos + 1));

        if (name.empty() || dna.empty()) {
            error = "Línea CSV con nombre o dna vacío: " + line;
            return false;
        }

        suspects.push_back({name, dna});
    }

    if (suspects.empty()) {
        error = "El CSV no contiene registros válidos";
        return false;
    }

    return true;
}

// ----------------- main -----------------

int main() {
    json output;

    try {
        // 1) Leer desde stdin: primera línea = ruta CSV, segunda = patrón
        string csvPath;
        string pattern;

        if (!std::getline(std::cin, csvPath) || csvPath.empty()) {
            output["status"]  = "error";
            output["message"] = "No se recibió la ruta del CSV por stdin";
            std::cout << output.dump() << std::endl;
            return 1;
        }

        if (!std::getline(std::cin, pattern)) {
            output["status"]  = "error";
            output["message"] = "No se recibió el patrón por stdin";
            std::cout << output.dump() << std::endl;
            return 1;
        }

        // 2) Cargar CSV
        vector<Suspect> suspects;
        string errorMsg;
        if (!loadSuspectsFromCsv(csvPath, suspects, errorMsg)) {
            output["status"]  = "error";
            output["message"] = errorMsg;
            std::cout << output.dump() << std::endl;
            return 1;
        }

        // 3) Preparar KMP
        string_view pat_view(pattern);
        vector<int> lps = buildLps(pat_view);

        // 4) Filtrar sospechosos que contienen el patrón
        json coincidencias = json::array();
        for (const auto& s : suspects) {
            string_view dna_view(s.dna);
            if (kmpContains(dna_view, pat_view, lps)) {
                // Para que encaje con tu API actual, devolvemos solo los nombres
                coincidencias.push_back(s.name);
            }
        }

        // 5) Construir salida JSON
        /*output["status"]        = "ok";
        output["pattern"]       = pattern;
        output["count"]         = coincidencias.size();*/
        output["coincidencias"] = coincidencias;

        std::cout << output.dump() << std::endl;
        return 0;

    } catch (const std::exception& e) {
        output["status"]  = "error";
        output["message"] = e.what();
        std::cout << output.dump() << std::endl;
        return 1;
    } catch (...) {
        output["status"]  = "error";
        output["message"] = "Excepción desconocida";
        std::cout << output.dump() << std::endl;
        return 1;
    }
}
