import { defHttp } from '/@/utils/http/axios';

enum Api {
  ListDoc = '/reader/listDoc',
  ReadDoc = '/reader/readDoc',
  UploadDoc = '/reader/uploadDoc',
  DelDoc = '/reader/delDoc',
  DelAllDoc = '/reader/delAllDoc'
}

/**
 * @description: Get doc list
 */
export const getListDoc = () =>
  defHttp.get({
    url: Api.ListDoc
  })

/**
 * @description: Del file
 */
export const doDelFile = (name: string) =>
  defHttp.delete({
    url: `${Api.DelDoc}/${name}`
  })

/**
 * @description: Del file
 */
export const doDelAllFile = () =>
  defHttp.delete({
    url: `${Api.DelDoc}/${name}`
  })

/**
 * @description: Read file content
 */
export const doReadFile = (name: string) =>
  defHttp.get({
    url: `${Api.ReadDoc}/${name}`
  })
