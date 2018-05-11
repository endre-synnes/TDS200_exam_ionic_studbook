import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import googleApiEnv from "../../app/googleApiEnv"


@Injectable()
export class LocationProvider {

  private GOOGLE_GEOCODE_API_KEY: string = googleApiEnv.googleApiKey;

  constructor(public http: HttpClient) {
  }

  getLocation(lat, lng){
    return new Promise( (resolve, reject) => {
      this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true&key=${this.GOOGLE_GEOCODE_API_KEY}`)
        .subscribe(
          function (data) {
            resolve(data)
          },
          function (error) {
              reject(error)
            }
        );
    });
  }

}
