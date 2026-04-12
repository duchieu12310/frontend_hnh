import ApplicationConstants from 'constants/ApplicationConstants';
import { CollectionWrapper } from 'types';
import { UploadedImageResponse } from 'models/Image';

/**
 * RequestParams dùng để chứa các query param
 */
export interface RequestParams extends Record<string, any> {
  page?: number;
  size?: number;
  sort?: string;
  filter?: string;
  search?: string;
  all?: number;
}

/**
 * ListResponse dùng để thể hiện đối tượng trả về sau lệnh getAll
 */
export interface ListResponse<O = unknown> {
  content: O[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/**
 * ErrorMessage dùng để thể hiện đối tượng lỗi trả về sau lệnh fetch
 */
export interface ErrorMessage {
  statusCode: number;
  timestamp: string;
  message: string;
  description: string;
}

type BasicRequestParams = Record<string, string | number | null | boolean>;

class FetchUtils {
  /**
   * Helper để parse JSON an toàn (tránh lỗi Unexpected end of JSON input khi body trống)
   */
  private static async safeJson<O>(response: Response): Promise<O> {
    const text = await response.text();
    if (!response.ok) {
        try {
            throw JSON.parse(text);
        } catch (e) {
            throw { statusCode: response.status, message: text || response.statusText } as ErrorMessage;
        }
    }
    return text ? JSON.parse(text) : {} as O;
  }

  /**
   * Hàm get cho các trường hợp truy vấn dữ liệu bên client
   */
  static async get<O>(resourceUrl: string, requestParams?: BasicRequestParams): Promise<O> {
    const response = await fetch(FetchUtils.concatParams(resourceUrl, requestParams));
    return await FetchUtils.safeJson<O>(response);
  }

  /**
   * Hàm post cho các trường hợp thực hiện truy vấn POST
   */
  static async post<I, O>(resourceUrl: string, requestBody: I): Promise<O> {
    const response = await fetch(resourceUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    return await FetchUtils.safeJson<O>(response);
  }

  /**
   * Hàm put cho các trường hợp thực hiện truy vấn PUT
   */
  static async put<I, O>(resourceUrl: string, requestBody: I, requestParams?: BasicRequestParams): Promise<O> {
    const response = await fetch(FetchUtils.concatParams(resourceUrl, requestParams), {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    return await FetchUtils.safeJson<O>(response);
  }

  /**
   * Hàm getWithToken
   */
  static async getWithToken<O>(resourceUrl: string, requestParams?: BasicRequestParams, isAdmin?: boolean): Promise<O> {
    const token = JSON.parse(localStorage
      .getItem(isAdmin ? 'electro-admin-auth-store' : 'electro-auth-store') || '{}').state?.jwtToken;

    const response = await fetch(FetchUtils.concatParams(resourceUrl, requestParams), {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    return await FetchUtils.safeJson<O>(response);
  }

  /**
   * Hàm postWithToken
   */
  static async postWithToken<I, O>(resourceUrl: string, requestBody: I, isAdmin?: boolean): Promise<O> {
    const token = JSON.parse(localStorage
      .getItem(isAdmin ? 'electro-admin-auth-store' : 'electro-auth-store') || '{}').state?.jwtToken;

    const response = await fetch(resourceUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    return await FetchUtils.safeJson<O>(response);
  }

  /**
   * Hàm putWithToken
   */
  static async putWithToken<I, O>(resourceUrl: string, requestBody: I, isAdmin?: boolean): Promise<O> {
    const token = JSON.parse(localStorage
      .getItem(isAdmin ? 'electro-admin-auth-store' : 'electro-auth-store') || '{}').state?.jwtToken;

    const response = await fetch(resourceUrl, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    return await FetchUtils.safeJson<O>(response);
  }

  /**
   * Hàm deleteWithToken
   */
  static async deleteWithToken<T>(resourceUrl: string, entityIds: T[], isAdmin?: boolean) {
    const token = JSON.parse(localStorage
      .getItem(isAdmin ? 'electro-admin-auth-store' : 'electro-auth-store') || '{}').state?.jwtToken;

    const response = await fetch(resourceUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(entityIds),
    });

    if (!response.ok) {
      throw await FetchUtils.safeJson(response);
    }
  }

  /**
   * Hàm getAll
   */
  static async getAll<O>(resourceUrl: string, requestParams?: RequestParams): Promise<ListResponse<O>> {
    const response = await fetch(FetchUtils.concatParams(resourceUrl, { ...requestParams }));
    const json = await FetchUtils.safeJson<any>(response);
    
    return {
      content: json.data ?? json.content ?? [],
      page: json.number ?? json.page ?? 0,
      size: json.size ?? 0,
      totalElements: json.totalElements ?? 0,
      totalPages: json.totalPages ?? 0,
      last: json.last ?? false,
    };
  }

  /**
   * Hàm getById
   */
  static async getById<O>(resourceUrl: string, entityId: number): Promise<O> {
    const response = await fetch(resourceUrl + '/' + entityId);
    return await FetchUtils.safeJson<O>(response);
  }

  /**
   * Hàm create
   */
  static async create<I, O>(resourceUrl: string, requestBody: I): Promise<O> {
    const response = await fetch(resourceUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    return await FetchUtils.safeJson<O>(response);
  }

  /**
   * Hàm update
   */
  static async update<I, O>(resourceUrl: string, entityId: number, requestBody: I): Promise<O> {
    const response = await fetch(resourceUrl + '/' + entityId, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    return await FetchUtils.safeJson<O>(response);
  }

  /**
   * Hàm deleteById
   */
  static async deleteById<T>(resourceUrl: string, entityId: T) {
    const response = await fetch(resourceUrl + '/' + entityId, { method: 'DELETE' });
    if (!response.ok) {
      throw await FetchUtils.safeJson(response);
    }
  }

  /**
   * Hàm deleteByIds
   */
  static async deleteByIds<T>(resourceUrl: string, entityIds: T[]) {
    const response = await fetch(resourceUrl, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entityIds),
    });
    if (!response.ok) {
      throw await FetchUtils.safeJson(response);
    }
  }

  /**
   * Hàm uploadMultipleImages
   */
  static async uploadMultipleImages(images: File[]): Promise<CollectionWrapper<UploadedImageResponse>> {
    const formData = new FormData();
    images.forEach((image) => formData.append('images', image));

    const response = await fetch(ApplicationConstants.HOME_PATH + '/images/upload-multiple', {
      method: 'POST',
      body: formData,
    });

    return await FetchUtils.safeJson<CollectionWrapper<UploadedImageResponse>>(response);
  }

  /**
   * Hàm concatParams dùng để nối url và requestParams
   */
  private static concatParams = (url: string, requestParams?: BasicRequestParams) => {
    if (requestParams) {
      const filteredRequestParams = Object.fromEntries(Object.entries(requestParams)
        .filter(([, v]) => v != null && String(v).trim() !== '')) as Record<string, string>;
      if (Object.keys(filteredRequestParams).length === 0) {
        return url;
      }
      return url + '?' + new URLSearchParams(filteredRequestParams).toString();
    }
    return url;
  };
}

export default FetchUtils;
