import {ClassConstructor} from "class-transformer";

declare module "axios" {
    interface AxiosRequestConfig {
        classTransformConfig?: {
            /** The class to transform the response to */
            targetClass: ClassConstructor<any>;
            /** A map function to retrieve the data from the plain response */
            dataRetriever?: (data: any) => any;
        };
    }
}