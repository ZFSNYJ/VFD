<template>
	<a-modal 
		title="快捷键大全"
		width="60%"
		:visible="modalVisible"
		okText="确认"
		cancelText="取消"
		@ok="saveSetting"
		@cancel="cancel">
		<a-table
			rowKey="code"
			:columns="columns"
			:dataSource="dataSource">
		</a-table>
	</a-modal>
</template>

<script>
	import { flowConfig } from '../config/args-config.js'
	
	export default {
		data () {
			return {
				modalVisible: false,
				columns: [
					{
						title: '功能',
						align: 'center',
						key: 'shortcutName',
						dataIndex: 'shortcutName',
						width: '50%'
					},
					{
						title: '快捷键',
						align: 'center',
						key: 'codeName',
						dataIndex: 'codeName',
						width: '50%'
					}
				],
				dataSource: []
			}
		},
		methods: {
			open () {
				const that = this;
				
				that.modalVisible = true;
				let obj = Object.assign({}, flowConfig.shortcut);
				for (let k in obj) {
					that.dataSource.push(obj[k]);
				}
			},
			close () {
				this.dataSource = [];
				this.modalVisible = false;
			},
			saveSetting () {
				this.close();
			},
			cancel () {
				this.close();
			}
		}
	}
</script>

<style>
</style>