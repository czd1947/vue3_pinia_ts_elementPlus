/**
 * URL 参数转换工具类
 */
export class UrlParamUtil {
  /**
   * 将对象转换为 URL 查询字符串 (例如: {a: 1, b: 2} -> a=1&b=2)
   * @param params 待转换的对象
   * @param options 配置项：prefix (前缀), includeEmpty (是否包含空值)
   */
  static stringify(
    params: Record<string, any>,
    options: { prefix?: boolean; includeEmpty?: boolean } = {},
  ): string {
    if (!params) return "";

    const { prefix = false, includeEmpty = false } = options;
    const searchParams = new URLSearchParams();

    // 递归处理对象，支持数组和嵌套对象
    const appendToParams = (data: any, parentKey: string | null = null) => {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          const fullKey = parentKey ? `${parentKey}[${key}]` : key;

          // 处理空值过滤
          if (
            !includeEmpty &&
            (value === null || value === undefined || value === "")
          ) {
            continue;
          }

          if (value !== null && typeof value === "object") {
            // 递归处理数组或嵌套对象
            appendToParams(value, fullKey);
          } else {
            searchParams.append(fullKey, String(value));
          }
        }
      }
    };

    appendToParams(params);

    const queryString = searchParams.toString();
    return prefix && queryString ? `?${queryString}` : queryString;
  }
}
