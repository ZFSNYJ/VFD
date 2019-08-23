<template>
	<div>
		<a-tabs size="small" defaultActiveKey="flow-attr" :activeKey="activeKey">
			<a-tab-pane key="flow-attr">
				<span slot="tab">
					<a-icon type="cluster" />
					流程属性
				</span>
				<a-form layout="horizontal">
					<a-form-item label="流程id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
						<a-input :value="flowData.attr.id" disabled />
					</a-form-item>
				</a-form>
			</a-tab-pane>
			<a-tab-pane key="node-attr">
				<span slot="tab">
					<a-icon type="profile" />
					节点属性
				</span>
				<template v-if="currentSelect.type == 'start'">
					<a-form layout="horizontal">
						<a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-tag color="purple">{{ currentSelect.type }}</a-tag>
						</a-form-item>
						<a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input :value="currentSelect.id" disabled />
						</a-form-item>
						<a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
						</a-form-item>
					</a-form>
				</template>
				<template v-if="currentSelect.type == 'end'">
					<a-form layout="horizontal">
						<a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-tag color="purple">{{ currentSelect.type }}</a-tag>
						</a-form-item>
						<a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input :value="currentSelect.id" disabled />
						</a-form-item>
						<a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
						</a-form-item>
					</a-form>
				</template>
				<template v-if="currentSelect.type == 'common'">
					<a-form layout="horizontal">
						<a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-tag color="purple">{{ currentSelect.type }}</a-tag>
						</a-form-item>
						<a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input :value="currentSelect.id" disabled />
						</a-form-item>
						<a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
						</a-form-item>
					</a-form>
				</template>
				<template v-else-if="currentSelect.type == 'freedom'">
					<a-form layout="horizontal">
						<a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-tag color="purple">{{ currentSelect.type }}</a-tag>
						</a-form-item>
						<a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input :value="currentSelect.id" disabled />
						</a-form-item>
						<a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
						</a-form-item>
					</a-form>
				</template>
				<template v-else-if="currentSelect.type == 'event'">
					<a-form layout="horizontal">
						<a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-tag color="purple">{{ currentSelect.type }}</a-tag>
						</a-form-item>
						<a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input :value="currentSelect.id" disabled />
						</a-form-item>
						<a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
						</a-form-item>
					</a-form>
				</template>
				<template v-else-if="currentSelect.type == 'gateway'">
					<a-form layout="horizontal">
						<a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-tag color="purple">{{ currentSelect.type }}</a-tag>
						</a-form-item>
						<a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input :value="currentSelect.id" disabled />
						</a-form-item>
						<a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
						</a-form-item>
					</a-form>
				</template>
				<template v-else-if="currentSelect.type == 'child-flow'">
					<a-form layout="horizontal">
						<a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-tag color="purple">{{ currentSelect.type }}</a-tag>
						</a-form-item>
						<a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input :value="currentSelect.id" disabled />
						</a-form-item>
						<a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
						</a-form-item>
					</a-form>
				</template>
				<template v-else-if="currentSelect.type == 'x-lane' || currentSelect.type == 'y-lane'">
					<a-form layout="horizontal">
						<a-form-item label="类型" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-tag color="purple">{{ currentSelect.type }}</a-tag>
						</a-form-item>
						<a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input :value="currentSelect.id" disabled />
						</a-form-item>
						<a-form-item label="名称" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
							<a-input placeholder="请输入节点名称" :value="currentSelect.nodeName" @change="nodeNameChange" />
						</a-form-item>
					</a-form>
				</template>
			</a-tab-pane>
			<a-tab-pane key="link-attr">
				<span slot="tab">
					<a-icon type="branches" />
					连线属性
				</span>
				<a-form layout="horizontal">
					<a-form-item label="id" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
						<a-input :value="currentSelect.id" disabled />
					</a-form-item>
					<a-form-item label="源节点" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
						<a-input :value="currentSelect.sourceId" disabled />
					</a-form-item>
					<a-form-item label="目标节点" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
						<a-input :value="currentSelect.targetId" disabled />
					</a-form-item>
					<a-form-item label="文本" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
						<a-input :value="currentSelect.label" @change="linkLabelChange" />
					</a-form-item>
				</a-form>
			</a-tab-pane>
		</a-tabs>
	</div>
</template>

<script>
	import jsplumb from 'jsplumb'
	import { flowConfig } from '../config/args-config.js'
	
	export default {
		props: ['plumb', 'flowData', 'select'],
		components: {
			jsplumb
		},
		data () {
			return {
				currentSelect: this.select,
				formItemLayout: {
					labelCol: { span: 6 },
					wrapperCol: { span: 16 }
				},
				activeKey: 'flow-attr'
			}
		},
		methods: {
			nodeNameChange (e) {
				this.currentSelect.nodeName = e.target.value;
			},
			linkLabelChange (e) {
				const that = this;
				let label = e.target.value;
				
				that.currentSelect.label = label;
				let conn = that.plumb.getConnections({
					source: that.currentSelect.sourceId,
					target: that.currentSelect.targetId
				})[0];
				if (label != '') {
					conn.setLabel({
						label: label,
						cssClass: 'linkLabel'
					});
				} else {
					let labelOverlay = conn.getLabelOverlay();
					if (labelOverlay) conn.removeOverlay(labelOverlay.id);
				}
			}
		},
		watch: {
			select (val) {
				this.currentSelect = val;
				if (this.currentSelect.type == 'link') {
					this.activeKey = 'link-attr';
				} else if (!this.currentSelect.type) {
					this.activeKey = 'flow-attr';
				} else {
					this.activeKey = 'node-attr';
				}
			},
			currentSelect: {
				handler (val) {
					this.$emit('update:select', val);
				},
				deep: true
			}
		}
	}
</script>

<style lang="scss">
	@import '../style/flow-attr.scss'
</style>