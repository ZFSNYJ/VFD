<template>
	<div style="height: 100%;">
		<a-layout class="container">
			<a-layout-sider
				width="300"
				theme="light"
				class="select-area">
				<a-row>
					<a-checkable-tag v-model="tag.checked0" @change="toggleNodeShow0" class="tag">工具</a-checkable-tag>
					<div align="center">
						<a-list
							:grid="{ gutter: 8, column: 1 }"
							v-if="tag.toolShow">
							<a-list-item>
								<a-button-group>
									<a-button 
										v-for="(tool, index) in field.tools" 
										:key="index" 
										:icon="tool.icon"
										:type="currentTool.type == tool.type ? 'primary': 'default'"
										@click="selectTool(tool.type)">
									</a-button>
								</a-button-group>
							</a-list-item>
						</a-list>
					</div>
				</a-row>
				<a-row>
					<a-checkable-tag v-model="tag.checked1" @change="toggleNodeShow1" class="tag">基础节点</a-checkable-tag>
					<div align="center">
						<a-list
							:grid="{ gutter: 8, column: 2 }"
							v-if="tag.commonNodeShow">
							<a-list-item v-for="(commonNode, index) in field.commonNodes" :key="index">
								<div class="node-item" :type="commonNode.type" belongto="commonNodes">
									<a-icon :component="commonNode.icon" /> {{ commonNode.nodeName }}
								</div>
							</a-list-item>
						</a-list>
					</div>
				</a-row>
				<a-row>
					<a-checkable-tag v-model="tag.checked2" @change="toggleNodeShow2" class="tag">高级节点</a-checkable-tag>
					<div align="center">
						<a-list
							:grid="{ gutter: 8, column: 2 }"
							v-if="tag.highNodeShow">
							<a-list-item v-for="(highNode, index) in field.highNodes" :key="index">
								<div class="node-item" :type="highNode.type" belongto="highNodes">
									<a-icon :component="highNode.icon" /> {{ highNode.nodeName }}
								</div>
							</a-list-item>
						</a-list>
					</div>
				</a-row>
				<a-row>
					<a-checkable-tag v-model="tag.checked3" @change="toggleNodeShow3" class="tag">泳道节点</a-checkable-tag>
					<div align="center">
						<a-list
							:grid="{ gutter: 8, column: 2 }"
							v-if="tag.laneNodeShow">
							<a-list-item v-for="(laneNode, index) in field.laneNodes" :key="index">
								<div class="node-item" :type="laneNode.type" belongto="laneNodes">
									<a-icon :component="laneNode.icon" /> {{ laneNode.nodeName }}
								</div>
							</a-list-item>
						</a-list>
					</div>
				</a-row>
			</a-layout-sider>
			<a-layout>
				<a-layout-header class="header-option">
					<a-tooltip title="保存流程" placement="bottom">
						<a-button @click="saveFlow" class="header-option-button" size="small" icon="save"></a-button>
					</a-tooltip>
					<a-tooltip title="生成流程图片" placement="bottom">
						<a-button @click="exportFlowPicture" class="header-option-button" size="small" icon="picture"></a-button>
					</a-tooltip>
					<a-popconfirm title="确认要重新绘制吗？" placement="bottom" okText="确认" cancelText="取消" @confirm="clear">
						<a-tooltip title="重新绘制" placement="bottom">
							<a-button class="header-option-button" size="small" icon="delete"></a-button>
						</a-tooltip>
					</a-popconfirm>
					<a-tooltip :title="flowData.config.showGridText" placement="bottom">
						<a-button 
							@click="toggleShowGrid" 
							class="header-option-button" 
							size="small" 
							:icon="flowData.config.showGridIcon">
						</a-button>
					</a-tooltip>
					<a-tooltip title="设置" placement="bottom">
						<a-button @click="setting" class="header-option-button" size="small" icon="setting"></a-button>
					</a-tooltip>
					<a-popconfirm 
						title="请选择帮助项：" 
						placement="bottom" 
						okType="default" 
						okText="快捷键大全" 
						cancelText="使用文档" 
						@confirm="shortcutHelper"
						@cancel="usingDoc">
						<a-icon slot="icon" type="question-circle-o" style="color: red" />
						<a-tooltip title="帮助" placement="bottom">
							<a-button class="header-option-button" size="small" icon="book"></a-button>
						</a-tooltip>
					</a-popconfirm>
					<a-tooltip title="退出" placement="bottom">
						<a-button @click="exit" class="header-option-button" size="small" icon="logout"></a-button>
					</a-tooltip>
				</a-layout-header>
				<a-layout-content class="content">
					<flow-area 
						ref="flowArea" 
						:browserType="browserType"
						:flowData="flowData" 
						:select.sync="currentSelect" 
						:selectGroup.sync="currentSelectGroup" 
						:plumb="plumb" 
						:currentTool="currentTool" 
						@findNodeConfig="findNodeConfig"
						@selectTool="selectTool"
						@getShortcut="getShortcut"
						@saveFlow="saveFlow">
					</flow-area>
					<vue-context-menu 
						:contextMenuData="linkContextMenuData" 
						@deleteLink="deleteLink">
					</vue-context-menu>
				</a-layout-content>
				<a-layout-footer class="foot">
					<span>VDF {{ info.version }}, Powered by {{ info.author }}</span>
				</a-layout-footer>
			</a-layout>
			<a-layout-sider
				width="350"
				theme="light"
				class="attr-area"
				@mousedown.stop="loseShortcut">
				<flow-attr :plumb="plumb" :flowData="flowData" :select.sync="currentSelect"></flow-attr>
			</a-layout-sider>
		</a-layout>
		<a-modal 
			:title="'流程设计图_' + flowData.attr.id + '.png'"
			centered
			width="90%"
			:closable="flowPicture.closable"
			:maskClosable="flowPicture.maskClosable"
			:visible="flowPicture.modalVisible"
			okText="下载到本地"
			cancelText="取消"
			@ok="downLoadFlowPicture"
			@cancel="cancelDownLoadFlowPicture">
			<div align="center">
				<img :src="flowPicture.url" />
			</div>
		</a-modal>
		<setting-modal ref="settingModal"></setting-modal>
		<shortcut-modal ref="shortcutModal"></shortcut-modal>
		<test-modal ref="testModal" @loadFlow="loadFlow"></test-modal>
	</div>
</template>

<script>
	import jsplumb from 'jsplumb'
	import { tools, commonNodes, highNodes, laneNodes } from './config/basic-node-config.js'
	import { flowConfig } from './config/args-config.js'
	import { startSvg, endSvg, commonSvg, freedomSvg, gatewaySvg, eventSvg, childFlowSvg, xLaneSvg, yLaneSvg, lanePoolSvg } from './config/basic-icon-config.js'
	import $ from 'jquery'
	import 'jquery-ui/ui/widgets/draggable'
	import 'jquery-ui/ui/widgets/droppable'
	import 'jquery-ui/ui/widgets/resizable'
	import html2canvas from 'html2canvas'
	import canvg from 'canvg'
	import { ZFSN } from './util/ZFSN.js'
	import FlowArea from './modules/FlowArea'
	import FlowAttr from './modules/FlowAttr'
	import SettingModal from './modules/SettingModal'
	import ShortcutModal from './modules/ShortcutModal'
	import UsingDocModal from './modules/UsingDocModal'
	import TestModal from './modules/TestModal'
	
	export default {
		name: 'vfd',
		components: {
			jsplumb,
			flowConfig,
			html2canvas,
			canvg,
			FlowArea,
			FlowAttr,
			SettingModal,
			ShortcutModal,
			UsingDocModal,
			TestModal,
			StartIcon: { template: startSvg },
			EndIcon: { template: endSvg },
			CommonIcon: { template: commonSvg },
			FreedomIcon: { template: freedomSvg },
			GatewayIcon: { template: gatewaySvg },
			EventIcon: { template: eventSvg },
			ChildFlowIcon: { template: childFlowSvg },
			XLaneIcon: { template: xLaneSvg },
			YLaneIcon: { template: yLaneSvg },
			LanePoolIcon: { template: lanePoolSvg }
		},
		mounted () {
			const that = this;
			that.dealCompatibility();
			that.initNodeSelectArea();
			that.initJsPlumb();
			that.listenShortcut();
			that.initFlow();
			that.listenPage();
			
			setTimeout(function() {
				ZFSN.consoleLog([
					'欢迎使用VFD流程设计器!', 
					'当前版本：' + that.info.version,
					'Powered by ' + that.info.author,
					'码云：' + that.info.gitee
				]);
				that.$notification.open({
					placement: 'bottomRight',
					message: '欢迎使用VFD流程设计器!',
					description: <p>
									当前版本：1.0.5<br />
									Powered by ZSFN<br />
									码云：<a target="blank" href="https://gitee.com/yjblogs/VFD">VFD流程设计器</a>
								</p>,
					icon: <a-icon type="smile" style="color: #108ee9" />
				});
			}, 1000);
		},
		data () {
			return {
				info: {
					version: '1.0.5',
					author: 'ZSFN',
					gitee: 'https://gitee.com/yjblogs/VFD'
				},
				tag: {
					checked0: true,
					checked1: true,
					checked2: true,
					checked3: true,
					toolShow: true,
					commonNodeShow: true,
					highNodeShow: true,
					laneNodeShow: true
				},
				browserType: 3,
				plumb: {},
				field: {
					tools: tools,
					commonNodes: commonNodes,
					highNodes: highNodes,
					laneNodes: laneNodes
				},
				flowData: {
					nodeList: [],
					linkList: [],
					attr: {
						id: ''
					},
					config: {
						showGrid: true,
						showGridText: '隐藏网格',
						showGridIcon: 'eye'
					},
					status: flowConfig.flowStatus.CREATE,
					remarks: []
				},
				currentTool: {
					type: 'drag',
					icon: 'drag',
					name: '拖拽'
				},
				currentSelect: {},
				currentSelectGroup: [],
				activeShortcut: true,
				linkContextMenuData: flowConfig.contextMenu.link,
				flowPicture: {
					url: '',
					modalVisible: false,
					closable: false,
					maskClosable: false
				}
			}
		},
		methods: {
			toggleNodeShow0 (flag) {
				if (!flag) {
					this.tag.toolShow = false;
				} else {
					this.tag.toolShow = true;
				}
			},
			toggleNodeShow1 (flag) {
				if (!flag) {
					this.tag.commonNodeShow = false;
				} else {
					this.tag.commonNodeShow = true;
				}
			},
			toggleNodeShow2 (flag) {
				if (!flag) {
					this.tag.highNodeShow = false;
				} else {
					this.tag.highNodeShow = true;
				}
			},
			toggleNodeShow3 (flag) {
				if (!flag) {
					this.tag.laneNodeShow = false;
				} else {
					this.tag.laneNodeShow = true;
				}
			},
			getBrowserType () {
				let userAgent = navigator.userAgent;
				let isOpera = userAgent.indexOf("Opera") > -1;
				if (isOpera) {
					return 1;
				}; 
				if (userAgent.indexOf("Firefox") > -1) {
					return 2;
				} 
				if (userAgent.indexOf("Chrome") > -1) {
					return 3;
				}
				if (userAgent.indexOf("Safari") > -1) {
					return 4;
				} 
				if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
					alert('IE浏览器支持性较差，推荐使用Firefox或Chrome');
					return 5;
				}
				if (userAgent.indexOf("Trident") > -1) {
					alert('Edge浏览器支持性较差，推荐使用Firefox或Chrome');
					return 6;
				};
			},
			dealCompatibility () {
				const that = this;
				
				that.browserType = that.getBrowserType();
				if (that.browserType == 2) {
					flowConfig.shortcut.scaleContainer = {
						code: 16,
						codeName: 'SHIFT(chrome下为ALT)',
						shortcutName: '画布缩放',
					};
				}
			},
			initJsPlumb () {
				const that = this;
				
				that.plumb = jsPlumb.getInstance(flowConfig.jsPlumbInsConfig);
				
				that.plumb.bind('beforeDrop', function(info) {
					let sourceId = info.sourceId;
					let targetId = info.targetId;
					
					if (sourceId == targetId) return false;
					let filter = that.flowData.linkList.filter(link => (link.sourceId == sourceId && link.targetId == targetId));
					if (filter.length > 0) {
						that.$message.error('同方向的两节点连线只能有一条！');
						return false;
					}
					return true;
				});
				
				that.plumb.bind('connection', function(conn, e) {
					let connObj = conn.connection.canvas;
					let o = {}, id, label;
					if (that.flowData.status == flowConfig.flowStatus.CREATE || that.flowData.status == flowConfig.flowStatus.MODIFY) {
						id = 'link-' + ZFSN.getId();
						label = '';
					} else if (that.flowData.status == flowConfig.flowStatus.LOADING) {
						let l = that.flowData.linkList[that.flowData.linkList.length - 1];
						id = l.id;
						label = l.label;
					}
					connObj.id = id;
					o.type = 'link';
					o.id = id;
					o.sourceId = conn.sourceId;
					o.targetId = conn.targetId;
					o.label = label;
					o.cls = {
						linkType: flowConfig.jsPlumbInsConfig.Connector[0],
						linkColor: flowConfig.jsPlumbInsConfig.PaintStyle.stroke,
						linkThickness: flowConfig.jsPlumbInsConfig.PaintStyle.strokeWidth
					};
					$('#' + id).bind('contextmenu', function(e) {
						that.showLinkContextMenu(e);
						that.currentSelect = that.flowData.linkList.filter(l => l.id == id)[0];
					});
					$('#' + id).bind('click', function(e) {
						let event = window.event || e;
						event.stopPropagation();
						that.currentSelect = that.flowData.linkList.filter(l => l.id == id)[0];
					});
					if (that.flowData.status != flowConfig.flowStatus.LOADING) that.flowData.linkList.push(o);
				});
				
				that.plumb.importDefaults({
					ConnectionsDetachable: flowConfig.jsPlumbConfig.conn.isDetachable
				});
				
				ZFSN.consoleLog(['实例化JsPlumb成功...']);
			},
			initNodeSelectArea () {
				$(document).ready(function() {
					$(".node-item").draggable({
						opacity: flowConfig.defaultStyle.dragOpacity,
						helper: 'clone',
						cursorAt: {
							top: 16,
							left: 60
						},
						containment: "window",
						revert: "invalid"
					});
					ZFSN.consoleLog(['初始化节点选择列表成功...']);
				});
			},
			listenShortcut () {
				const that = this;
				document.onkeydown = function(e) {
					let event = window.event || e;
					
					if (!that.activeShortcut) return;
					let key = event.keyCode;
					
					switch (key) {
						case flowConfig.shortcut.multiple.code:
							that.$refs.flowArea.rectangleMultiple.flag = true;
							break;
						case flowConfig.shortcut.dragContainer.code:
							that.$refs.flowArea.container.dragFlag = true;
							break;
						case flowConfig.shortcut.scaleContainer.code:
							that.$refs.flowArea.container.scaleFlag = true;
							break;
						case flowConfig.shortcut.dragTool.code: 
							that.selectTool('drag');
							break;
						case flowConfig.shortcut.connTool.code:
							that.selectTool('connection');
							break;
						case flowConfig.shortcut.zoomInTool.code:
							that.selectTool('zoom-in');
							break;
						case flowConfig.shortcut.zoomOutTool.code:
							that.selectTool('zoom-out');
							break;
						case 37:
							that.moveNode('left');
							break;
						case 38:
							that.moveNode('up');
							break;
						case 39:
							that.moveNode('right');
							break;
						case 40:
							that.moveNode('down');
							break;
					}
					
					if (event.ctrlKey) {
						if (event.altKey) {
							switch (key) {
								case flowConfig.shortcut.settingModal.code:
									that.setting();
									break;
								case flowConfig.shortcut.testModal.code:
									that.openTest();
									break;
							}
						}
					}
				}
				document.onkeyup = function(e) {
					let event = window.event || e;
					
					let key = event.keyCode;
					if (key == flowConfig.shortcut.dragContainer.code) {
						that.$refs.flowArea.container.dragFlag = false;
					} else if (key == flowConfig.shortcut.scaleContainer.code) {
						event.preventDefault();
						that.$refs.flowArea.container.scaleFlag = false;
					} else if (key == flowConfig.shortcut.multiple.code) {
						that.$refs.flowArea.rectangleMultiple.flag = false;
					}
				}
				
				ZFSN.consoleLog(['初始化快捷键成功...']);
			},
			listenPage () {
				window.onbeforeunload = function (e) {
					e = e || window.event;
					if (e) {
						e.returnValue = '关闭提示';
					}
					return '关闭提示';
				};
			},
			initFlow () {
				const that = this;
				
				if (that.flowData.status == flowConfig.flowStatus.CREATE) {
					that.flowData.attr.id = 'flow-' + ZFSN.getId();
				} else {
					that.loadFlow();
				}
				ZFSN.consoleLog(['初始化流程图成功...']);
			},
			loadFlow (json) {
				const that = this;
				
				that.clear();
				let loadData = JSON.parse(json);
				that.flowData.attr = loadData.attr;
				that.flowData.config = loadData.config;
				that.flowData.status = flowConfig.flowStatus.LOADING;
				that.plumb.batch(function() {
					let nodeList = loadData.nodeList;
					nodeList.forEach(function(node, index) {
						that.flowData.nodeList.push(node);
					});
					let linkList = loadData.linkList;
					that.$nextTick(() => {
						linkList.forEach(function(link, index) {
							that.flowData.linkList.push(link);
							let conn = that.plumb.connect({
								source: link.sourceId,
								target: link.targetId,
								anchor: flowConfig.jsPlumbConfig.anchor.default,
								connector: [
									link.cls.linkType,
									{
										gap: 5,
										cornerRadius: 8,
										alwaysRespectStubs: true
									}
								],
								paintStyle: {
									stroke: link.cls.linkColor,
									strokeWidth: link.cls.linkThickness
								}
							});
							if (link.label != '') {
								conn.setLabel({
									label: link.label,
									cssClass: 'linkLabel'
								});
							}
						});
						that.currentSelect = {};
						that.currentSelectGroup = [];
						that.flowData.status = flowConfig.flowStatus.MODIFY;
					});
				}, true);
				let canvasSize = that.computeCanvasSize();
				that.$refs.flowArea.container.pos = {
					top: -canvasSize.minY + 100,
					left: -canvasSize.minX + 100
				}
			},
			findNodeConfig (belongto, type, callback) {
				let node = null;
				switch (belongto) {
					case 'commonNodes':
						node = commonNodes.filter(n => n.type == type);
						break;
					case 'highNodes':
						node = highNodes.filter(n => n.type == type);
						break;
					case 'laneNodes':
						node = laneNodes.filter(n => n.type == type);
						break;
				}
				if (node && node.length >= 0) node = node[0];
				callback(node);
			},
			selectTool (type) {
				let tool = tools.filter(t => t.type == type);
				if (tool && tool.length >= 0) this.currentTool = tool[0];
				
				switch (type) {
					case 'drag':
						this.changeToDrag();
						break;
					case 'connection':
						this.changeToConnection();
						break;
					case 'zoom-in':
						this.changeToZoomIn();
						break;
					case 'zoom-out':
						this.changeToZoomOut();
						break;
				}
			},
			changeToDrag () {
				const that = this;
				
				that.flowData.nodeList.forEach(function(node, index) {
					let f = that.plumb.toggleDraggable(node.id);
					if (!f) {
						that.plumb.toggleDraggable(node.id);
					}
					if (node.type != 'x-lane' && node.type != 'y-lane') {
						that.plumb.unmakeSource(node.id);
						that.plumb.unmakeTarget(node.id);
					}
				});
			},
			changeToConnection() {
				const that = this;
				
				that.flowData.nodeList.forEach(function(node, index) {
					let f = that.plumb.toggleDraggable(node.id);
					if (f) {
						that.plumb.toggleDraggable(node.id);
					}
					if (node.type != 'x-lane' && node.type != 'y-lane') {
						that.plumb.makeSource(node.id, flowConfig.jsPlumbConfig.makeSourceConfig);
						that.plumb.makeTarget(node.id, flowConfig.jsPlumbConfig.makeTargetConfig);
					}
				});
				
				that.currentSelect = {};
				that.currentSelectGroup = [];
			},
			changeToZoomIn () {
				console.log('切换到放大工具');
			},
			changeToZoomOut () {
				console.log('切换到缩小工具');
			},
			checkFlow () {
				const that = this;
				let nodeList = that.flowData.nodeList;
				
				if (nodeList.length <= 0) {
					this.$message.error('流程图中无任何节点！');
					return false;
				}
				return true;
			},
			saveFlow () {
				const that = this;
				let flowObj = Object.assign({}, that.flowData);
				
				if (!that.checkFlow()) return;
				flowObj.status = flowConfig.flowStatus.SAVE;
				let d = JSON.stringify(flowObj);
				console.log(d);
				this.$message.success('保存流程成功！请查看控制台。');
				return d;
			},
			exportFlowPicture () {
				const that = this;
				
				if (!that.checkFlow()) return;
				
				let $Container = that.$refs.flowArea.$el.children[0],
					svgElems = $($Container).find('svg[id^="link-"]'),
					removeArr = [];
				
				svgElems.each(function(index, svgElem) {
			    	let linkCanvas = document.createElement('canvas');
			    	let canvasId = 'linkCanvas-' + ZFSN.getId();
			    	linkCanvas.id = canvasId;
			    	removeArr.push(canvasId);
			    	
			    	let svgContent = svgElem.outerHTML.trim();
			    	canvg(linkCanvas, svgContent);
			    	if (svgElem.style.position) {
			            linkCanvas.style.position += svgElem.style.position;
			            linkCanvas.style.left += svgElem.style.left;
			            linkCanvas.style.top += svgElem.style.top;
			        }
			    	$($Container).append(linkCanvas);
				});
				
				let canvasSize = that.computeCanvasSize();
				
				let pbd = flowConfig.defaultStyle.photoBlankDistance;
				let offsetPbd = ZFSN.div(pbd, 2);
				
				html2canvas($Container, {
					width: canvasSize.width + pbd,
					height: canvasSize.height + pbd,
					scrollX: -canvasSize.minX + offsetPbd,
					scrollY: -canvasSize.minY + offsetPbd,
					logging: false,
					onclone: function(args) {
						removeArr.forEach(function(id, index) {
							$('#' + id).remove();
						});
					}
				}).then(canvas => {
					let dataURL = canvas.toDataURL('image/png');
					that.flowPicture.url = dataURL;
					that.flowPicture.modalVisible = true;
				});
			},
			downLoadFlowPicture () {
				const that = this;
				let alink = document.createElement('a');
				let alinkId = 'alink-' + ZFSN.getId();
				alink.id = alinkId;
				alink.href = that.flowPicture.url;
				alink.download = '流程设计图_' + that.flowData.attr.id + '.png';
				alink.click();
			},
			cancelDownLoadFlowPicture () {
				this.flowPicture.url = '';
				this.flowPicture.modalVisible = false;
			},
			computeCanvasSize () {
				const that = this;
				let nodeList = Object.assign([], that.flowData.nodeList), 
					minX = nodeList[0].x, 
					minY = nodeList[0].y, 
					maxX = nodeList[0].x + nodeList[0].width, 
					maxY = nodeList[0].y + nodeList[0].height;
				nodeList.forEach(function(node, index) {
					minX = Math.min(minX, node.x);
					minY = Math.min(minY, node.y);
					maxX = Math.max(maxX, node.x + node.width);
					maxY = Math.max(maxY, node.y + node.height);
				});
				let canvasWidth = maxX - minX;
				let canvasHeight = maxY - minY;
				return {
					width: canvasWidth,
					height: canvasHeight,
					minX: minX,
					minY: minY,
					maxX: maxX,
					maxY: maxY
				};
			},
			clear () {
				const that = this;
				that.flowData.nodeList.forEach(function(node, index) {
					that.plumb.remove(node.id);
				});
				that.currentSelect = {};
				that.currentSelectGroup = [];
				that.flowData.nodeList = [];
				that.flowData.linkList = [];
				that.flowData.remarks = [];
			},
			toggleShowGrid () {
				let flag = this.flowData.config.showGrid;
				if (flag) {
					this.flowData.config.showGrid = false;
					this.flowData.config.showGridText = '显示网格';
					this.flowData.config.showGridIcon = 'eye-invisible';
				} else {
					this.flowData.config.showGrid = true;
					this.flowData.config.showGridText = '隐藏网格';
					this.flowData.config.showGridIcon = 'eye';
				}
			},
			setting () {
				this.$refs.settingModal.open();
			},
			shortcutHelper () {
				this.$refs.shortcutModal.open();
			},
			usingDoc () {
				window.open(this.info.gitee);
			},
			exit () {
				alert('退出流程设计器...');
			},
			showLinkContextMenu (e) {
				let event = window.event || e;
				
				event.preventDefault();
				event.stopPropagation();
				$('.vue-contextmenuName-flow-menu').css('display', 'none');
				$('.vue-contextmenuName-node-menu').css('display', 'none');
				let x = event.clientX;
				let y = event.clientY;
				this.linkContextMenuData.axis = { x, y };
			},
			deleteLink () {
				const that = this;
				let sourceId = that.currentSelect.sourceId;
				let targetId = that.currentSelect.targetId;
				that.plumb.deleteConnection(that.plumb.getConnections({
					source: sourceId,
					target: targetId
				})[0]);
				let linkList = that.flowData.linkList;
				linkList.splice(linkList.findIndex(link => (link.sourceId == sourceId || link.targetId == targetId)), 1);
				that.currentSelect = {};
			},
			loseShortcut () {
				this.activeShortcut = false;
			},
			getShortcut () {
				this.activeShortcut = true;
			},
			openTest () {
				const that = this;
				
				let flowObj = Object.assign({}, that.flowData);
				that.$refs.testModal.flowData = flowObj;
				that.$refs.testModal.testVisible = true;
			},
			moveNode (type) {
				const that = this;
				
				let m = flowConfig.defaultStyle.movePx, isX = true;
				switch (type) {
					case 'left':
						m = -m;
						break;
					case 'up':
						m = -m;
						isX = false;
						break;
					case 'right':
						break;
					case 'down':
						isX = false;
				}
				
				if (that.currentSelectGroup.length > 0) {
					that.currentSelectGroup.forEach(function(node, index) {
						if (isX) {
							node.x += m;
						} else {
							node.y += m;
						}
					});
					that.plumb.repaintEverything();
				} else if (that.currentSelect.id) {
					if (isX) {
						that.currentSelect.x += m;
					} else {
						that.currentSelect.y += m;
					}
					that.plumb.repaintEverything();
				}
			}
		}
	}
</script>

<style lang="scss">
	@import './style/flow-designer.scss'
</style>
