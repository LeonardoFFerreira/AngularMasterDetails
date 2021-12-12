import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';

import { HttpClient } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

import { Injector } from '@angular/core';



export abstract class BaseResourceService<T extends BaseResourceModel>{

    protected httpClient: HttpClient;

    constructor(
        protected apiPath: string,
        protected injector: Injector,
        protected jsonToResourceFn: (jsonData: any) => T
    ) {
        this.httpClient = injector.get(HttpClient);
    }

    getAll(): Observable<T[]> {
        return this.httpClient.get(this.apiPath).pipe(
            map(this.jsonDataToResources.bind(this)),
            catchError(this.handleError)
        )
    }

    getById(id: number): Observable<T> {
        const url = `${this.apiPath}/${id}`;
        return this.httpClient.get(url).pipe(
            map(this.jsonDataToResource.bind(this)),
            catchError(this.handleError)
        )
    }

    create(resource: T): Observable<T> {
        return this.httpClient.post(this.apiPath, resource).pipe(
            map(this.jsonDataToResource.bind(this)),
            catchError(this.handleError)
        )
    }

    update(resource: T): Observable<T> {
        const url = `${this.apiPath}/${resource.id}`;
        return this.httpClient.put(url, resource).pipe(
            map(() => resource),
            catchError(this.handleError)
        )
    }

    delete(id: number): Observable<any> {
        const url = `${this.apiPath}/${id}`;
        return this.httpClient.delete(url).pipe(
            map(() => null),
            catchError(this.handleError)
        )
    }

    //PROTECTED METHODS
    protected jsonDataToResources(jsonData): T[] {
        const resources: T[] = [];

        jsonData.forEach(
            el => resources.push(this.jsonToResourceFn(el))
        );
        return resources;
    }

    protected jsonDataToResource(jsonData: any): T {
        return this.jsonToResourceFn(jsonData);
    }

    protected handleError(error: any): Observable<any> {
        console.log("ERRO NA REQUISIÇÃO =>", error);
        return throwError(error);
    }
}