/* eslint-disable max-lines-per-function */

import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import {classTransformValidateResponse} from "./ClassTransformValidateResponse";
import {IsNotEmpty, IsNumber, IsPositive, IsString} from "class-validator";
import {Expose} from "class-transformer";

axios.defaults.transformResponse = classTransformValidateResponse;
describe("ClassTransformValidateResponse", () => {
    const mock = new MockAdapter(axios);
    let response: any;
    beforeEach(() => {
        mock.onGet("/test").reply(200, JSON.stringify(response));
    });
    describe("when single response", () => {
        describe("when valid response", () => {
            beforeAll(() => {
                response = {
                    id: 1,
                    name: "test"
                };
            });
            it("should return the class instance", async () => {
                const result = await axios.get("/test", {
                    classTransformConfig: {
                        targetClass: TestClass
                    }
                });
                expect(result.data).toEqual(response);
                expect(result.data).toBeInstanceOf(TestClass);
            });
        });
        describe("when invalid response", () => {
            beforeAll(() => {
                response = {
                    id: "1",
                    name: "test"
                };
            });
            it("should throw an error", async () => {
                await expect(axios.get("/test", {
                    classTransformConfig: {
                        targetClass: TestClass
                    }
                })).rejects.toThrow("Validation failed");
            });
        });
    });
    describe("when multiple response", () => {
        describe("when valid response", () => {
            beforeAll(() => {
                response = [
                    {
                        id: 1,
                        name: "test"
                    },
                    {
                        id: 2,
                        name: "test"
                    }
                ];
            });
            it("should return the class instance", async () => {
                const result = await axios.get("/test", {
                    classTransformConfig: {
                        targetClass: TestClass
                    }
                });
                expect(result.data).toEqual(response);
                expect(result.data).toHaveLength(2);
                expect(result.data[0]).toBeInstanceOf(TestClass);
                expect(result.data[1]).toBeInstanceOf(TestClass);
            });
        });
        describe("when invalid response", () => {
            beforeAll(() => {
                response = [
                    {
                        id: "1",
                        name: "test"
                    },
                    {
                        id: 2,
                        name: "test"
                    }
                ];
            });
            it("should leave the invalid out", async () => {
                const result = await axios.get("/test", {
                    classTransformConfig: {
                        targetClass: TestClass
                    }
                });
                expect(result.data).toHaveLength(1);
            });
        });
    });
    describe("when data is nested", () => {
        describe("when valid response", () => {
            beforeAll(() => {
                response = {
                    data: {
                        id: 1,
                        name: "test"
                    }
                };
            });
            it("should return the class instance", async () => {
                const result = await axios.get("/test", {
                    classTransformConfig: {
                        targetClass: TestClass,
                        dataRetriever: (data: any) => data.data
                    }
                });
                expect(result.data).toEqual(response.data);
                expect(result.data).toBeInstanceOf(TestClass);
            });
        });
    });
});

class TestClass {
    @IsNumber()
    @IsPositive()
    @Expose()
    id!: number;

    @IsNotEmpty()
    @IsString()
    @Expose()
    name!: string;
}