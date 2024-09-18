import axios from 'axios-https-proxy-fix'
import https from 'https'


export class Proxy {
    activeProxies = [];
    inActiveProxies = [];
    currentProxyIndex = 0;
  
    addProxies = async (stringProxies) => {
        stringProxies.forEach(async (proxy) => {
        proxy = await this.toProxyObject(proxy)
        await this.addProxy(proxy);
      });
      return {
        activeProxies: this.activeProxies,
        inActiveProxies: this.inActiveProxies,
      };
    };
    addProxy = async (proxy) => {
      await this.checkProxy(proxy).then((isValid) => {
        isValid ? this.addActiveOne(proxy) : this.addInActiveOne(proxy);
      });
    };
    checkProxy = async (proxy) => {
      try {
        let response = await axios.get(
          "https://play.google.com/store/apps/details?id=com.prequel.app&hl=en&gl=US",
          {
            proxy: {
              ...proxy,
              httpAgent: https.Agent({ keepAlive: true }) 
            },
            timeout: 50000,
          }
        );
        return response.status === 200;
      } catch (err) {
        return false;
      }
    };
    checkActiveOne = async (proxy)=>{
      let isActive = await this.checkProxy(proxy);
      if(!isActive){
        this.removeActiveOne(proxy);
        this.addInActiveOne(proxy);
      }
    }
    getNextProxy = () => {
      if (this.activeProxies.length) {
        const proxy = this.activeProxies[this.currentProxyIndex];
        this.currentProxyIndex = (this.currentProxyIndex + 1) % this.activeProxies.length;
        console.log("index:",this.currentProxyIndex, " proxy :", proxy)
        return proxy;
      }
    };
    addActiveOne = (proxy) => {
      let isExist = false;
      this.activeProxies.map((px) => {
        if (px.host === proxy.host) isExist = true;
      });
      !isExist ? this.activeProxies.push(proxy) : null;
    };
    removeActiveOne = (proxy) => {
        this.activeProxies = this.activeProxies.filter((px) => proxy.host != px.host);
    };
    addInActiveOne = (proxy) => {
      let isExist = false;
      this.inActiveProxies.map((px) => {
        if (px.host === proxy.host) isExist = true;
      });
      !isExist ? this.inActiveProxies.push(proxy) : null;
    };
    removeInActiveOne = (proxy) => {
        this.inActiveProxies = this.inActiveProxies.filter((px) => proxy.host != px?.host);
    };
    removeInActiveProxies = () => {
        this.inActiveProxies = [];
    };
    toProxyObject = async (stringProxy) => {
      let proxy = stringProxy.split(":");
      proxy = {
        host: proxy[0],
        port: proxy[1],
        auth: {
          username: proxy[2],
          password: proxy[3],
        },
      };
      return proxy;
    }; 
    checkInactiveProxiesHealth = async () => {
      this.inActiveProxies.forEach(async (proxy) => {
        const stillWork = await this.checkProxy(proxy);
        if(stillWork){
          this.removeInActiveOne(proxy);
          this.addActiveOne(proxy);
        }
      });
    }
  }