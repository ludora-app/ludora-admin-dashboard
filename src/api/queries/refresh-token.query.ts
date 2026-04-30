import ky from "ky";

import { getApiUrl } from "@/utils/api-url";

import { RefreshTokenDto, RefreshTokenResponseDto } from "../generated/model";

export const POST = async (refreshToken: RefreshTokenDto["refreshToken"]) => {
  const response = await ky
    .post(`${getApiUrl()}/auth-b2c/refresh-token`, {
      json: { refreshToken },
    })
    .json<RefreshTokenResponseDto>();
  return response;
};
