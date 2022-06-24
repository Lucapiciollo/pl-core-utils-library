import { AxiosRequestConfig, AxiosRequestTransformer, AxiosResponse, AxiosResponseTransformer } from "axios";
import { AbsHttpClient, Http, IHttpCLient, Injectable, Singleton } from "pl-decorator";




@Injectable
@Singleton
@Http({
  headers: { prova1: "prova1", prova2: "prova2" },
  interceptors: {
    request: (request: AxiosRequestTransformer | AxiosRequestTransformer[]) => {
      console.log(request);
      return request
    },
    response: (response: AxiosResponseTransformer | AxiosResponseTransformer[]) => {
      console.log(response);
      return response;
    }
  }
})
export class MyHttpClient implements IHttpCLient {


  constructor() {
    this.get("http://localhost:4200", {
      transformRequest: (request: AxiosRequestTransformer | AxiosRequestTransformer[]) => {
        console.log(request);
        return request
      }}).then(response => {
        console.log(response)
      })

  }
  getUri(config?: AxiosRequestConfig<any>): string {
    throw new Error("Method not implemented.");
  }
  request(config: AxiosRequestConfig<any>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  get(url: string, config?: AxiosRequestConfig<any>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  delete(url: string, config?: AxiosRequestConfig<any>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  head(url: string, config?: AxiosRequestConfig<any>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  options(url: string, config?: AxiosRequestConfig<any>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  post<T = any, R = AxiosResponse<T, any>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  put<T = any, R = AxiosResponse<T, any>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  patch<T = any, R = AxiosResponse<T, any>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  download(url: string, config?: AxiosRequestConfig<any>): Promise<any> {
    throw new Error("Method not implemented.");
  }
  upload(url: string, formlData: FormData, config?: AxiosRequestConfig<any>): Promise<any> {
    throw new Error("Method not implemented.");
  }

}