<template>
  <div id="app">
    <header>
      <div class="u-typeCut">
        <a class="" title="炫酷铃声" @click="handleType(1)" :class="{active : 1 === active}">炫酷铃声</a>
        <a  title="精选壁纸" @click="handleType(2)" :class="{active : 2 === active}">精选壁纸</a>
      </div>
      <div class="u-historyBt">
        <a class="back" title="后退"></a>
        <a class="forward" title="前进"></a>
      </div>
      <a class="u-refresh" title="刷新" @click="handleRefresh"></a>
      <div class="u-search" ref="borderColor">
        <input id="search-text" name="search-text" type="text" maxlength="30" placeholder="搜索铃声" @click="handleSearch(1)" @blur="handleSearch(2)">
        <a id="search-btn"></a>
        <ul class="search-ul"></ul>
      </div>
      <div class="u-appleID">
        <a id="jiaocheng_div_fled" href="#" target="_blank">{{ msg }}</a>
      </div>
    </header>
    <main>
      <nav>
        <ul>
          <template v-if="active == '1'">
            <li v-for="(item, index) in ringNav" :key="index">
              <div :class="['main-nav--ringNav',!item.child.length && parentCurrent === index ? 'active' : item.child.length && parentCurrent === index ? 'select' : '']" @click="handleMenu(index, item, 'parent')">
                {{ item.name }}
              </div>
              <dl class="main-nav--content" v-if="item.child.length">
                <dd :class="[parentCurrent === index && childCurrent === childIndex ? 'active' : '']" v-for="(child, childIndex) in item.child" :key="childIndex" @click="handleMenu(childIndex, item, 'child', index)">
                  {{ child.name }}
                </dd>
              </dl>
            </li>
          </template>
          <template v-if="active == '2'">
            <li v-for="(item, index) in paperNav" :key="index">
              <div :class="['main-nav--paperNav',!item.child.length && parentCurrent === index ? 'active' : item.child.length && parentCurrent === index ? 'select' : '']" @click="handleMenu(index, item, 'parent')">
                {{ item.name }}
              </div>
              <dl class="main-nav--content" v-if="item.child.length">
                <dd :class="[parentCurrent === index && childCurrent === childIndex ? 'active' : '']" v-for="(child, childIndex) in item.child" :key="childIndex" @click="handleMenu(childIndex, item, 'child', index)">
                  {{ child.name }}
                </dd>
              </dl>
            </li>
          </template>
        </ul>
      </nav>
      <div class="m-body">
        <router-view v-if="isRouterAlive"></router-view>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "app",
  components: {},
  provide() {
    return{
      reload: this.reload
    }
  },
  data() {
    let ringNav = [
      { name : "酷音铃声", child : [] },
      { 
        name : "爱思铃声", 
        child : [
          { name : "精选" },
          { name : "周排行" },
          { name : "月排行" },
          { name : "总排行" },
          { name : "最新" },
          { name : "分类" },
        ] 
      },
      { name : "铃声制作", child : [] },
    ];
    let paperNav = [
      { name : "精选", child : [] },
      { 
        name : "排行榜", 
        child : [
          { name : "周排行" },
          { name : "月排行" },
          { name : "总排行" },
        ] 
      },
      { name : "最新", child : [] },
      { name : "分类", child : [] },
    ];
    return {
      ringNav,
      paperNav,
      active: 1,
      msg: "如何设置铃声?",
      parentCurrent: 0,
      childCurrent: "",
      isRouterAlive: true,
    }
  },
  methods: {
    handleType(index) {
      this.active = index;
      if(this.active === 1) {
        this.msg = "如何设置铃声?";
        this.$refs.borderColor.style.display = "block";
        this.isActive = this.ringNav;
        this.parentCurrent = 0;
        this.childCurrent = "";
      } else {
        this.msg = "如何设置壁纸?";
        this.$refs.borderColor.style.display = "none";
        this.isActive = this.paperNav;
        this.parentCurrent = 0;
        this.childCurrent = "";
      }

      if(this.ok == 'ringNav') {
        this.ok = 'paperNav';
      } else {
        this.ok = 'ringNav';
      }
    },
    handleRefresh() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      })
    },
    handleSearch(flags) {
      switch (flags) {
        case 1:
          this.$refs.borderColor.className = "u-search borders";
          break;
        case 2:
          this.$refs.borderColor.className = "u-search";
          break;
      }
    },
    handleMenu(index, item, status ,parentIndex) {
      let that = this;
      if(status === 'parent') {
        Object.assign(that, {
          parentCurrent: index,
          childCurrent : item.child && item.child.length ? 0 : "",
        })
      }
      if(status === 'child') {
        Object.assign(this, {
          childCurrent : index,
          parentCurrent: parentIndex,
        })
      }
      
      this.$router.push({ path: 'About' });
    },
  }
}
</script>

<style lang="scss">
@import url(./style/style.css);
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

header {
  width: 1001px;
  height: 40px;
  padding-top: 6px;
  border-right: 1px solid #eee;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  clear: both;
  .u-typeCut {
    padding-left: 13px;
    display: inline-block;
    float: left;
    a {
      width: 74px;
      height: 26px;
      line-height: 26px;
      margin-left: -1px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      display: inline-block;
      text-align: center;
      font-size: 12px;
      color: #979797;
      float: left;
      &.active {
        color: #2359FF;
        border: 1px solid #6C90FF;
        background: #E8EEFF;
        position: relative;
        z-index: 99;
      }
    }
  }
  .u-historyBt {
    padding-left: 30px;
    display: inline-block;
    float: left;
    a {
      width: 36px;
      height: 26px;
      margin-left: -1px;
      border: 1px solid #ccc;
      display: inline-block;
      box-sizing: border-box;
      position: relative;
      float: left;
      &:after {
        content: "";
        width: 20px;
        height: 20px;
        margin-top: -9px;
        margin-left: -9px;
        background: url(./assets/topBt.png) no-repeat;
        position: absolute;
        top: 50%;
        left: 50%;
      }
      &:nth-child(1)::after {
        background-position: -20px -20px;
      }
      &:nth-child(2)::after {
        background-position: -40px -20px;
      }
      &:nth-child(1) {
        border-radius: 2px 0 0 2px;
      }
      &:nth-child(2) {
        border-radius: 0 2px 2px 0;
      }
    }
  }
  .u-refresh {
    width: 36px;
    height: 26px;
    margin-left: 13px;
    border: 1px solid #ccc;
    border-radius: 2px;
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    float: left;
    &:after {
      content: "";
      width: 20px;
      height: 20px;
      margin-top: -9px;
      margin-left: -9px;
      display: block;
      background: url(./assets/topBt.png) no-repeat;
      background-position: -1px 0;
      position: absolute;
      top: 50%;
      left: 50%;
    }
    &:hover {
      background: #fafafa;
    }
  }
  .u-search {
    width: 169px;
    height: 26px;
    line-height: 24px;
    margin-left: 13px;
    border-radius: 2px;
    border: 1px solid #ccc;
    box-sizing: border-box;
    display: inline-block;
    position: relative;
    float: left;
    input {
      width: 100%;
      height: 16px;
      line-height: 16px;
      margin-top: 5px;
      padding-left: 6px;
      padding-right: 26px;
      font-size: 12px;
      border: none;
      box-sizing: border-box;
      &::-webkit-input-placeholder {
          /* WebKit, Blink, Edge */
          color: #d8d8d8;
        }
        &::-moz-placeholder {
          /* Mozilla Firefox 19+ */
          color: #d8d8d8;
        }
        &:-moz-placeholder {
          /* Mozilla Firefox 4 to 18 */
          color: #d8d8d8;
        }
        &:-ms-input-placeholder {
          /* Internet Explorer 10-11 */
          color: #d8d8d8;
        }
    }
    #search-btn {
      width: 20px;
      height: 20px;
      display: inline-block;
      background: url(./assets/search.png) center / 20px no-repeat;
      background-position-y: 0;
      position: absolute; 
      top: 3px;
      right: 3px;
    }
    &.borders {
      border: 1px solid #8aa1ff;
    }
    &.borders #search-btn{
      background-position-y: -20px;
    }
  }
  .u-appleID {
    height: 26px;
    line-height: 26px;
    margin-right: 10px;
    display: inline-block;
    float: right;
    #jiaocheng_div_fled {
      width: 156px;
      color: #090;
      text-decoration: underline;
      font-size: 12px;
    }
  }
}
main {
  width: 1001px;
  border-right: 1px solid #ddd;
  background: #fff;
  overflow: hidden;
  position: absolute;
  top: 40px;
  left: 0;
  bottom: 0;
  nav {
    width: 188px;
    height: 100%;
    border-right: 1px solid #ddd;
    background: #F7F9FF;
    position: relative;
    float: left; 
    li {
      width: 100%;
      height: 100%;
      .main-nav--ringNav {
        width: 100%;
        height: 36px;
        line-height: 38px;
        padding-left: 54px;
        display: block;
        position: relative;
        box-sizing: border-box;
        border-left: 4px solid #f7f9ff;
        text-decoration: none;
        cursor: pointer;
        font-size: 12px;
        color: #666;
        &:hover {
          background: #e8eeff;
        }
        &.active {
          color: #2359ff;
          background: #e8eeff;
          border-left: 4px solid #2359ff;
        }
        &::before {
          content: "";
          width: 20px;
          height: 20px;
          margin-top: -10px;
          display: block;
          background: url(./assets/navIcon.png) no-repeat;
          position: absolute;
          top: 50%;
          left: 26px;
        }
        &:nth-child(1)::before {
          background-position: -120px -20px;
        }
        &:nth-child(1).active::before {
          background-position: -120px 0;
        }
      }
      dl {
        height: 100%;
        dd {
          width: 188px;
          height: 36px;
          line-height: 38px;
          padding-left: 54px;
          display: block;
          position: relative;
          box-sizing: border-box;
          border-left: 4px solid #f7f9ff;
          text-decoration: none;
          cursor: pointer;
          font-size: 12px;
          color: #666;
          &:hover {
            background: #e8eeff;
          }
          &.active {
            color: #2359ff;
            background: #e8eeff;
            border-left: 4px solid #2359ff;
          }
        }
      }
      &:nth-of-type(2) .main-nav--ringNav::before {
        background-position: -140px -20px;
      }
      &:nth-of-type(2) .main-nav--ringNav.select::before {
        background-position: -140px 0;
      }
      &:nth-of-type(3) .main-nav--ringNav::before {
        background-position: -160px -20px;
      }
      &:nth-of-type(3) .main-nav--ringNav.active::before {
        background-position: -160px 0;
      }

      .main-nav--paperNav {
        width: 100%;
        height: 36px;
        line-height: 38px;
        padding-left: 54px;
        display: block;
        position: relative;
        box-sizing: border-box;
        border-left: 4px solid #f7f9ff;
        text-decoration: none;
        cursor: pointer;
        font-size: 12px;
        color: #666;
        &:hover {
          background: #e8eeff;
        }
        &.active {
          color: #2359ff;
          background: #e8eeff;
          border-left: 4px solid #2359ff;
        }
        &::before {
          content: "";
          width: 20px;
          height: 20px;
          margin-top: -10px;
          display: block;
          background: url(./assets/navIcon.png) no-repeat;
          position: absolute;
          top: 50%;
          left: 26px;
        }
        &:nth-child(1)::before {
          background-position: 0;
        }
        &:nth-child(1).active::before {
          background-position: 0 0;
        }
      }
      dl {
        height: 100%;
        dd {
          width: 188px;
          height: 36px;
          line-height: 38px;
          padding-left: 54px;
          display: block;
          position: relative;
          box-sizing: border-box;
          border-left: 4px solid #f7f9ff;
          text-decoration: none;
          cursor: pointer;
          font-size: 12px;
          color: #666;
          &:hover {
            background: #e8eeff;
          }
          &.active {
            color: #2359ff;
            background: #e8eeff;
            border-left: 4px solid #2359ff;
          }
        }
      }
      &:nth-of-type(2) .main-nav--paperNav::before {
        background-position: -80px -20px;
      }
      &:nth-of-type(2) .main-nav--paperNav.select::before {
        background-position: -80px 0;
      }
      &:nth-of-type(3) .main-nav--paperNav::before {
        background-position: -60px -20px;
      }
      &:nth-of-type(3) .main-nav--paperNav.active::before {
        background-position: -60px 0;
      }
      &:nth-of-type(4) .main-nav--paperNav::before {
        background-position: -100px -20px;
      }
      &:nth-of-type(4) .main-nav--paperNav.active::before {
        background-position: -100px 0;
      }
    }
  }
}
.m-body {
  width: 811px;
  height: 100%;
  float: left;
}
</style>
