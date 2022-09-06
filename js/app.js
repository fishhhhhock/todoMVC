(function (window) {
	'use strict';

	/*
		todoMVC的功能需求：
			* 渲染数据到任务列表
			* 输入内容回车键创建任务
			* 点击复选框可以：完成任务
			* 全选、不选和反选
			* 双击编辑任务项
			* 删除任务
			* 统计未完成的任务数量
			* 切换状态：数据进行切换（路由）
			* 清除所有的已完成任务
			* 数据本地存储
	*/
	// Your starting point. Enjoy the ride!

	// 封装一个存储方法
	let storage = {
		getItem() {
			// <!-- 获取数据：  localStorage.getItem(key) -->
			// <!-- 删除数据：  localStorage.removeItem(key) -->
			// <!-- 本地只能存储字符串，无法存储复杂数据类型，需要将复杂数据类型转换成JSON字符串，再存储到本地 -->
			// <!-- JSON.stringify(复杂数据类型)：将复杂数据转换成JSON字符串，存储在本地存储中 -->
			// <!-- JSON.parse(JSON字符串)：将JSON字符串转换成对象，取出时候使用 -->

			let res = localStorage.getItem('taskList');//取出来的值是字符串
			if (res) {
				res = JSON.parse(res);//把字符串转成对象
			} else {
				res = [];
			}
			return res;
		},
		setItem(data) {
			//  存储数据：  localStorage.setItem(key,value) 
			localStorage.setItem('taskList', JSON.stringify(data));//把传入的对象转成字符串，再存到本地存储中
		}
	}

	// 只需要执行一次，储存到本地后就可以把源代码注释掉
	// let taskList = [
	// {
	// id: 1,
	// title: '今天吃辣子鸡',
	// ischeck: false
	// },
	// {
	// id: 2,
	// title: '准备素材',
	// ischeck: false
	// },
	// {
	// id: 3,
	// title: '放暑假啦',
	// ischeck: false
	// }
	// ];
	// storage.setItem(taskList);//先把旧的数据存到本地



	let vm = new Vue({
		el: '.todoapp',
		data: {
			// taskList: [
			// {
			// id: 1,
			// title: '今天吃辣子鸡',
			// ischeck: false
			// },
			// {
			// id: 2,
			// title: '准备素材',
			// ischeck: false
			// },
			// {
			// id: 3,
			// title: '放暑假啦',
			// ischeck: false
			// }
			// ],
			taskList: storage.getItem(),
			msg: '',
			currentIndex: null,
			hash: ''//存放哈希存放的状态
		},
		// 存放方法
		methods: {
			// 功能
			add() {
				// alert('5566')
				// console.log(this.msg);
				let task = {//构造一个对象
					id: this.taskList.length + 1,
					title: this.msg,
					ischeck: false
				}
				this.taskList.push(task);//把新的数据插入到数组最后
				this.msg = ''//添加完成后清空内容框内容
			},
			// 功能edit:双击编辑任务项
			edit(index) {
				console.log(index);
				this.currentIndex = index;
			},
			// 功能：保存双击修改的内容
			keepItem(index) {
				this.currentIndex = null;
				if (!this.taskList[index].title) {
					// 如果数据为空
					this.taskList.splice(index, 1)//从下标为index起删除1行
				}
			},
			// 功能：点击删除某一行
			deleteItem(index) {
				this.taskList.splice(index, 1)//从下标为index起删除1行
			},
			// 功能：清除所有已完成的任务项
			removeCpt() {
				this.taskList = this.taskList.filter(item => item.ischeck == false);
				// console.log(this.hash);
				// 删除已完成任务项后回到all模块
				this.hash = 'all';
			}
		},
		// 计算属性：完成全选、不选和反选
		computed: {
			allCheck: {
				get() {//设置：下方的复选框如果都选中，则高亮按钮就高亮，只要有一个不选中，全选按钮就不高亮 下方 -> 上方
					return this.taskList.every(item => item.ischeck == true);
				},
				set(val) {
					console.log(val);
					this.taskList.forEach(item => {
						item.ischeck = val;
					});
				}
			},
			// 功能：统计未完成任务的条数
			total() {
				return this.taskList.filter(item => item.ischeck == false).length;
			},

			// 功能：通过哈希值的状态变化，把页面的数据更新：切换状态：数据进行切换(路由)
			filterTask() {
				switch (this.hash) {
					case 'all':
						return this.taskList;
						break;
					case 'active':
						return this.taskList.filter(item => item.ischeck == false);
						break;
					case 'completed':
						return this.taskList.filter(item => item.ischeck == true);
						break;

				}
			}
		},

		// 本地存储数据后，在页面改动内容，本地存储并没有跟着改变，所以这里要使用监听器
		watch: {
			// 这种写法只能监听到数组最外层数据的变化(即数组的增删操作)，里面内层的数据无法监听，所以我们要使用深度监听
			// taskList(newVal){
			// console.log('改了数据了');
			// }

			// 深度监听
			taskList: {
				deep: true,
				handler(newVal) {
					// console.log('改了数据了');
					storage.setItem(this.taskList);//只要有改变就重新存储一下
				}
			}
		},

		//  刷新打开网页后自动聚焦：局部指令注册
		directives: {
			'focus': {
				inserted(el) {
					el.focus();
				}
			},
			// 双击编辑任务时也需要自动聚焦
			'dblfocus': {
				update(el) {
					el.focus();
				}
			}
		}
	});

	// 切换状态:数据进行切换(路由)
	window.onhashchange = function () {
		// 如果页面的hash哈希发生改变，就会触发这个功能
		let hash = location.hash.slice(2);//删除字符串的前两个字符abcd => cd
		console.log(hash);
		vm.hash = hash;
	}

	window.onhashchange();










})(window);
