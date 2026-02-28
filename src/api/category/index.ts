import request from "@/utils/request";
import type {
  CategoryResponseData,
  AttributeResponseData,
  Attribute,
  AttributeDeleteResponseData,
} from "./type";

enum CategoryApi {
  CATEGORY_LIST = "/category",
  ATTR_LIST = "/attrInfoList/{category1Id}/{category2Id}/{category3Id}",
  ATTR_CREATE = "/add-attr",
  ATTR_UPDATE = "/update-attr/{id}",
  ATTR_DELETE = "/delete-attr/{id}",
  ATTR_VALUE_DELETE = "/delete-attr-value/{id}",
}

export const reqCategoryList = (parent_id: number = 0) =>
  request.post<any, CategoryResponseData>(CategoryApi.CATEGORY_LIST, {
    parent_id,
  });

export const reqAttrList = (
  category1Id: number,
  category2Id: number,
  category3Id: number,
) =>
  request.post<any, AttributeResponseData>(
    CategoryApi.ATTR_LIST.replace("{category1Id}", category1Id.toString())
      .replace("{category2Id}", category2Id.toString())
      .replace("{category3Id}", category3Id.toString()),
  );

export const reqAttrCreate = (data: Attribute) =>
  request.post<any, AttributeResponseData>(CategoryApi.ATTR_CREATE, data);

export const reqAttrUpdate = (id: number, data: Attribute) =>
  request.post<any, AttributeResponseData>(
    CategoryApi.ATTR_UPDATE.replace("{id}", id.toString()),
    data,
  );

export const reqAttrDelete = (id: number) =>
  request.post<any, AttributeDeleteResponseData>(
    CategoryApi.ATTR_DELETE.replace("{id}", id.toString()),
  );

export const reqAttrValueDelete = (id: number) =>
  request.post<any, AttributeDeleteResponseData>(
    CategoryApi.ATTR_VALUE_DELETE.replace("{id}", id.toString()),
  );
