import request from "@/utils/request";
import type {
  BrandResponseData,
  BrandRequest,
  BrandCreateResponseData,
} from "./type";

enum BrandApi {
  BRAND_LIST = "/brand",
  BRAND_CREATE = "/brand",
  BRAND_EDIT = "/brand/{id}/edit",
  BRAND_UPDATE = "/brand/{id}",
  BRAND_DELETE = "/brand/{id}",
}

export const reqBrandList = (pageNo: number, limit: number) =>
  request.get<any, BrandResponseData>(
    `${BrandApi.BRAND_LIST}?page=${pageNo}&limit=${limit}`,
  );

export const reqBrandCreate = (data: BrandRequest) =>
  request.post<any, BrandCreateResponseData>(BrandApi.BRAND_CREATE, data);

export const reqBrandEdit = (id: number) =>
  request.get<any, BrandCreateResponseData>(
    BrandApi.BRAND_EDIT.replace("{id}", id.toString()),
  );

export const reqBrandUpdate = (id: number, data: BrandRequest) =>
  request.put<any, BrandCreateResponseData>(
    BrandApi.BRAND_UPDATE.replace("{id}", id.toString()),
    data,
  );

export const reqBrandDelete = (id: number) =>
  request.delete<any, BrandCreateResponseData>(
    BrandApi.BRAND_DELETE.replace("{id}", id.toString()),
  );
