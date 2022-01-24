<template>
  <a-card :bordered="false">
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary">
        <template #icon><icon-font type="icon-plus" /></template>
        新增</a-button
      >
      <a-button
        @click="batchDel"
        v-if="selectedRowKeys.length > 0"
        ghost
        type="danger"
      >
        <template #icon><icon-font type="icon-delete"></icon-font></template>
        批量删除
      </a-button>
    </div>

    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px">
        已选择&nbsp;<a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项&nbsp;&nbsp;
      </div>

      <a-table
        :columns="columns"
        :scroll="{ x: 1500 }"
        :row-key="(record) => record.key"
        size="middle"
        :pagination="false"
        :dataSource="dataSource"
        :loading="loading"
        :rowSelection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange,
        }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'component'">
            <span :title="record[column.key]">{{
              $filters.ellipsis(record[column.key])
            }}</span>
          </template>
          <template v-else-if="column.key === 'url'">
            <span :title="record[column.key]">{{
              $filters.ellipsis(record[column.key])
            }}</span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a @click="handleEdit(record)">编辑</a>

            <a-divider type="vertical" />
            <a-dropdown>
              <a class="ant-dropdown-link"> 更多 <a-icon type="down" /> </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;" @click="handleDetail(record)"
                      >详情</a
                    >
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="handleAddSub(record)"
                      >添加下级</a
                    >
                  </a-menu-item>
                  <a-menu-item>
                    <a-popconfirm
                      title="确定删除吗?"
                      @confirm="() => handleDelete(record.id)"
                    >
                      <a>删除</a>
                    </a-popconfirm>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </template>
        </template>
      </a-table>
    </div>
  </a-card>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from "vue";
import { columns } from "./config";
import { getAction } from "@/api/api";
import { batchDelCommon } from "@/utils/common";
export default defineComponent({
  setup() {
    const loading = ref(false);
    const state = reactive({
      selectedRowKeys: [],
      dataSource: [],
    });
    const urlObj = {
      list: "/sys/permission/list",
      delete: "/sys/permission/delete",
      deleteBatch: "/sys/permission/deleteBatch",
    };
    const getPermissionList = async () => {
      loading.value = true;
      let res = await getAction<[]>(urlObj.list);
      if (res) state.dataSource = res.result;
      loading.value = false;
    };
    getPermissionList();

    const handleEdit = (obj) => {
      console.log("handleEdit", obj);
    };
    const handleDetail = (obj) => {
      console.log("handleDetail", obj);
    };
    const handleDelete = (id) => {
      console.log("handleDelete", id);
    };
    const handleAdd = () => {
      console.log("handleAdd");
    };
    const batchDel = () => {
      batchDelCommon(
        urlObj.deleteBatch,
        state.selectedRowKeys,
        loading,
        (bl) => {
          if (bl) getPermissionList();
        }
      );
    };
    const onSelectChange = (selectedRowKeys) => {
      state.selectedRowKeys = selectedRowKeys;
    };
    return {
      ...toRefs(state),
      loading,
      handleAdd,
      handleEdit,
      handleDetail,
      handleDelete,
      batchDel,
      onSelectChange,
      columns: columns,
    };
  },
});
</script>
<style lang="less">
@import "~@/style/table.less";
</style>
