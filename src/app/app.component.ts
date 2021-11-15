import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs/internal/Subscription';
import { GlobalDataService } from './service/global-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  data: any;
  chartOptions: any;
  subscription!: Subscription;
  //config: AppConfig;
  basicData: any;
  basicOptions: any;
  municipioData: any;
  dataMunicipio: any;
  basicDataMun: any;
  municipios: any;
  selectedMunicipio = this.fb.control([]);
  dayData: any;

  constructor(private globalDataService: GlobalDataService, private fb: FormBuilder) {

  }

  ngOnInit() {
    this.getGlobalData();

    this.globalDataService.getMunicipios().subscribe(res => {
      //this.municipios = res.map((x: any) => { return { codigo: x['c_digo_dane_del_municipio'], name: x.municipio } })
      this.municipios = res.map((x: any) => { return { codigo: x['c_digo_dane_del_municipio'], name: x.municipio } })
      this.selectedMunicipio.patchValue(this.municipios[0].codigo)
    })

    this.selectedMunicipio.valueChanges.subscribe(res => {
      this.getMunicipio(res)
    })

  }

  private getGlobalData() {
    this.globalDataService.getInfo().subscribe((data: any) => {
      console.log(data);
      this.dayData = {
        confirmados: data.Global.NewConfirmed,
        muertos: data.Global.NewDeaths,
        recuperados: data.Global.NewRecovered
      }
      console.log(this.dayData)
      this.basicData = {
        labels: ['Global'],
        datasets: [
          {
            label: 'Total Confirmados',
            backgroundColor: '#4EA641',
            data: [data.Global.TotalConfirmed]
          },
          {
            label: 'Total Muertos',
            backgroundColor: '#D9042B',
            data: [data.Global.TotalDeaths]
          },
          {
            label: 'Total Recuperados',
            backgroundColor: '#F29F05',
            data: [data.Global.TotalRecovered]
          }
        ]
      };
      this.data = {
        labels: ['Confirmados', 'Muertos', 'Recuperados'],
        datasets: [
          {
            data: [data.Global.TotalConfirmed, data.Global.TotalDeaths, data.Global.TotalRecovered],
            backgroundColor: [
              "#4EA641",
              "#D9042B",
              "#F29F05"
            ],
            hoverBackgroundColor: [
              "#4EA641",
              "#D9042B",
              "#F29F05"
            ]
          }
        ]
      };
    })
  }

  getMunicipio(codigo: string) {
    this.globalDataService.getSpecific(codigo).subscribe((data: any) => {
      var fechas: any = [];
      var casos: any = [];
      var fallecidos: any = [];
      var recuperados: any = [];
      var totalDatos: any = { casos: 0, fallecidos: 0, recuperados: 0 };
      data.map((datos: any) => {
        fechas.push(datos.fecha_diagnostico);
        casos.push(datos.casos);
        fallecidos.push(datos.fallecidos);
        recuperados.push(datos.recuperados);
        totalDatos.casos = totalDatos.casos + parseInt(datos.casos);
        totalDatos.fallecidos = totalDatos.fallecidos + parseInt(datos.fallecidos);
        totalDatos.recuperados = totalDatos.recuperados + parseInt(datos.recuperados);
      })
      console.log(totalDatos);
      this.municipioData = {
        labels: fechas,
        datasets: [
          {
            label: 'Total diario Confirmados',
            backgroundColor: '#4EA641',
            data: casos
          },
          {
            label: 'Total diario Muertos',
            backgroundColor: '#D9042B',
            data: fallecidos
          },
          {
            label: 'Total diario Recuperados',
            backgroundColor: '#F29F05',
            data: recuperados
          }
        ]
      };

      this.basicDataMun = {
        labels: ['Total'],
        datasets: [
          {
            label: 'Total Confirmados',
            backgroundColor: '#4EA641',
            data: [totalDatos.casos]
          },
          {
            label: 'Total Muertos',
            backgroundColor: '#D9042B',
            data: [totalDatos.fallecidos]
          },
          {
            label: 'Total Recuperados',
            backgroundColor: '#F29F05',
            data: [totalDatos.recuperados]
          },
          {
            label: 'Total Activos',
            backgroundColor: '#10ABEA',
            data: [(totalDatos.casos - totalDatos.fallecidos - totalDatos.recuperados)]
          }
        ]
      };
      this.dataMunicipio = {
        labels: ['Total Confirmados', 'Total Muertos', 'Total Recuperados', 'Total Activos'],
        datasets: [
          {
            data: [totalDatos.casos,
            totalDatos.fallecidos,
            totalDatos.recuperados,
            (totalDatos.casos - totalDatos.fallecidos - totalDatos.recuperados)],
            backgroundColor: [
              "#4EA641",
              "#D9042B",
              "#F29F05",
              "#10ABEA"

            ],
            hoverBackgroundColor: [
              "#4EA641",
              "#D9042B",
              "#F29F05",
              "#10ABEA"
            ]
          }
        ]
      };
    })
  }

}
