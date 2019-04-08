import React, { Component } from 'react'
import Cloud from '../Cloud'
import FireWork from '../FireWork'
import Prompt from '../Prompt'
import gameLevel from '../../assets/LevelData/data'
import { createBox } from '../../controller/box'
import reStart from '../../assets/imgs/reStart.jpg'
import levelChoose from '../../assets/imgs/levelChoose.jpg'
import { createTortoise,bindTortoise } from "../../controller/tortoise";


import './index.css'

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = { // level 表示游戏关卡, 初始是第一关
            level: 0,
            success: false,
            process: '闯关成功, 赶快试试下一关吧!',
            midProcess: '再接再厉, 还剩最后一关咯!',
            result: '恭喜你过了最难的一关！回首页看看吧!'
        };
        this.playAgain = this.playAgain.bind(this);
        this.nextLevel = this.nextLevel.bind(this);
    }

    componentWillMount() {
        let queryStr = this.props.location.search.split('?')[1];
        if(queryStr) {
            console.log(queryStr.split('=')[1]);
            this.setState({
                level: parseInt(queryStr.split('=')[1]) // 因为查询串取下的level是string类型的,这里要转为number类型,否则在切换到下一关时会因为字符串相加而找不到对应的数据出错
            })
        }
        console.log(queryStr)
    }

    componentDidMount() {
        bindTortoise(gameLevel[this.state.level], this) // 组件挂在完之后进行keydown事件的绑定
    }

    componentDidUpdate() {
        console.log('更新完成')
       if(!this.state.success) {
           createTortoise(gameLevel[this.state.level], true); // 注意这时候因为传入了true,所以不会返回jsx,而是对已经更新完成的tortoise进行定位，下面的createBox也是同理
           createBox(gameLevel[this.state.level], true);
           bindTortoise(gameLevel[this.state.level], this) // 在组件更新之后重新对组件进行事件绑定
       }
    }

    playAgain() {
        this.setState((state)=>{
            return {
                success: !state.success
            }
        })
    }

    nextLevel() {
        this.setState((state)=>{
            return {
                level: state.level + 1,
                success: !state.success
            }
        })
    }
    render() {
        console.log('重新渲染');
        let level = this.state.level;
        console.log(level);
        let levelData = gameLevel[level].map; // 根据关卡数选出对应数据, map是一个数组
        let sideLength = Math.sqrt(levelData.length) * 50;
        let dom = null;
        return (
            <div className="container">
                <Cloud />
                <div id="map" style={{ width: sideLength}}>
                    {
                        levelData.map((val, index)=>{
                            switch(val) { // 根据elem的值来应用样式
                                case 1 : dom = (<div className="cell" key={index}></div>); break; // 普通格子
                                case 2 : dom = (<div className="wall" key={index}></div>); break;// 墙
                                case 3 : dom = (<div className="target" key={index}></div>); break;// 目标格子
                                default: break;
                            }
                            return dom;
                        })
                    }
                    { createBox(gameLevel[level])  }
                    { createTortoise(gameLevel[level]) }
                    { this.state.success ? (<FireWork />) : '' }
                    { this.state.success ?  <Prompt
                        playAgain={this.playAgain}
                        nextLevel={this.nextLevel}
                        title={this.state.level === 2 ? this.state.result : (this.state.level === 0 ? this.state.process : this.state.midProcess)}/> : '' }
                </div>
            </div>
        )
    }
}

export default Map;
