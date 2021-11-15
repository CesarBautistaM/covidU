import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalDataService {

  private URL: string = 'https://api.covid19api.com/summary';
  private URLL: string = "https://www.datos.gov.co/resource/gt2j-8ykr.json?$group=ciudad_municipio, fecha_diagnostico&$select=fecha_diagnostico, ciudad_municipio,COUNT(*) as casos, SUM(CASE(recuperado LIKE '%25allecido%25', 1, true, 0)) AS fallecidos, SUM(CASE(recuperado LIKE '%25ecuperado%25', 1, true, 0)) AS recuperados, SUM(CASE(recuperado LIKE '%25ctivo%25', 1, true, 0)) AS activos, SUM(CASE(recuperado LIKE '%25N/A%25', 1, true, 0)) AS na&ciudad_municipio=";
  private URLMUNICIPIOSLIST: string = "https://www.datos.gov.co/resource/xdk5-pm3f.json"
  constructor(private http: HttpClient) { }

  getInfo() {
    return this.http.get<any>(this.URL);
  }

  getSpecific(municipio: string) {
    return this.http.get<any>(this.URLL + municipio);
  }

  getMunicipios() {
    return this.http.get<any>(this.URLMUNICIPIOSLIST);
  }

}
