import {plainToInstance} from "class-transformer";
import {validateSync} from "class-validator";
import axios, {InternalAxiosRequestConfig} from "axios";

/**
 * This is our default response transformer. It will transform the response to a class instance if the request config
 * has a classTransformConfig. It will also validate the class instance and throw an error if the validation fails.
 * Just configure the classTransformConfig in the request config and the response will be transformed.
 */
export function classTransformValidateResponse<T extends Object>(
    this: InternalAxiosRequestConfig, data: string
): T | T[] | string {
    const plain = JSON.parse(data);
    if (!this.classTransformConfig) {
        return plain;
    }
    const nestedPlain = this.classTransformConfig.dataRetriever
        ? this.classTransformConfig.dataRetriever(plain)
        : plain;
    const classInstance = plainToInstance(
        this.classTransformConfig.targetClass,
        nestedPlain,
        {excludeExtraneousValues: true}
    );
    if (Array.isArray(classInstance)) {
        return classInstance.filter((item) => {
            const errors = validateSync(item);
            if (errors.length > 0) {
                console.error("skipping item due to validation issues", errors);
                return false;
            }
            return true;
        });
    } else {
        const errors = validateSync(classInstance);
        if (errors.length > 0) {
            console.error(errors);
            throw new Error("Validation failed");
        }
        return classInstance;
    }
}

axios.defaults.transformResponse = classTransformValidateResponse;
