<template>
  <div class="p-4">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <BasicUpload
          :maxSize="20"
          :maxNumber="10"
          @change="handleReloadCurrent"
          :api="uploadApi"
          :showPreviewNumber="false"
          :accept="['doc','docx']"
          class="my-5"
        />
        <a-button type="primary" @click="downloadAll"> 下载所有文件 </a-button>
        <a-button type="danger" @click="deleteAllFile"> 删除所有文件 </a-button>
        <a-button type="primary" @click="handleReloadCurrent"> 刷新当前页 </a-button>
      </template>

      <template #action="{ record }">
        <span>
          <a @click="downloadFile(record)">下载</a>
          <Divider type="vertical" />
          <a @click="delFile(record)">删除</a>
          <Divider type="vertical" />
          <a @click="viewLink(record)" v-if="['.doc','.docx','.xlsx'].includes(record.type)">小陈陈专用</a>
        </span>
      </template>
    </BasicTable>

    <a-modal v-model:visible="modalVisible" :title="modalTitle">
      <div class="p-4">
        <p v-for="(s, index) in relList" :key="index">{{s}}</p>
        <a-empty v-if="!relList.length && !loading" />
        <Loading :loading="loading" :absolute="absolute" :tip="tip" />
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, createVNode, ref, reactive, toRefs } from 'vue';
import { BasicTable, useTable } from '/@/components/Table';
import { BasicUpload } from '/@/components/Upload';
import { getListDoc, doDelFile, doReadFile, doDelAllFile } from '/@/api/sys/reader';
import { uploadApi } from '/@/api/sys/upload';
import { Divider, Modal, notification, Empty } from 'ant-design-vue';
import { Icon } from '/@/components/Icon';
import { FileInfo } from './type'
import { Loading } from '/@/components/Loading';

export default defineComponent({
  components: { BasicTable, BasicUpload, Divider, 'a-modal': Modal, Loading, 'a-empty': Empty},

  setup () {
    let modalVisible = ref(false)
    let modalTitle = ref('')
    let relList = ref([])
    const compState = reactive({
      absolute: false,
      loading: false,
      tip: '加载中...',
    });

    const [ registerTable, { reload } ] = useTable({
      title: '读取Doc文档',
      api: getListDoc,
      canResize: false,
      pagination: false,
      columns: [
        {
          dataIndex: 'name',
          key: 'name',
          title: '名称'
        }, {
          dataIndex: 'size',
          key: 'size',
          title: '大小(MB)'
        }, {
          dataIndex: 'type',
          key: 'type',
          title: '格式'
        }, {
          dataIndex: 'action',
          key: 'action',
          title: '操作',
          slots: {
            customRender: 'action',
          }
        }
      ]
    })

    function handleReloadCurrent () : void {
      reload()
    }

    function downloadFile (obj : FileInfo) : void {
      // 下载文件
      window.open(`/api/reader/download/${obj.name}`, '_self')
    }

    function delFile (obj : FileInfo) : void {
      // 删除文件
      Modal.confirm({
        title: '确认删除该文件吗？',
        icon: createVNode(Icon, { icon: 'warning-outlined' }),
        content: createVNode(
          'div',
          {
            style: 'color:red;',
          },
          obj.name,
        ),

        onOk () {
          doDelFile(obj.name).then(() => {
            notification.success({
              message: '删除成功'
            })
            reload()
          })
        },

        onCancel() {
          console.log('Cancel');
        }
      })
    }

    function viewLink (obj : FileInfo) : void {
      // 查看解析内容
      compState.loading = true

      modalTitle.value = obj.name
      modalVisible.value = true
      relList.value = []

      doReadFile(obj.name).then((result) => {
        relList.value = result.match(/《(.*?)》/g) || []
      }).finally(() => {
        compState.loading = false
      })
    }

    function downloadAll () : void {
      // 下载文件
      window.open('/api/reader/downloadAll', '_self')
    }

    function deleteAllFile () : void {
      // 删除文件
      Modal.confirm({
        title: '确认删除所有文件吗？',
        icon: createVNode(Icon, { icon: 'warning-outlined' }),

        onOk () {
          doDelAllFile().then(() => {
            notification.success({
              message: '删除成功'
            })
            reload()
          })
        },

        onCancel() {
          console.log('Cancel');
        }
      })
    }

    return {
      modalTitle,
      modalVisible,
      relList,
      registerTable,
      handleReloadCurrent,
      uploadApi,
      downloadFile,
      delFile,
      deleteAllFile,
      viewLink,
      downloadAll,
      ...toRefs(compState)
    }
  }
})
</script>

<style scoped>

</style>
