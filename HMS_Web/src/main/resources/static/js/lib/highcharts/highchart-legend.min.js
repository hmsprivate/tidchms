/*
 Extention for Highcharts3 and Highstocks1.3 to add the Chart some functions: 
 legendHide() , legendShow() , legendToggle() 
 
 @author jan Kowalleck <jan.kowalleck@googlemail.com>
 @source https://bitbucket.org/jkowalleck/highcharts-legendextention/
*/
(function(b,a){if(!b){return}var c=b.Chart.prototype,d=b.Legend.prototype;b.extend(c,{legendSetVisibility:function(h){var i=this,k=i.legend,e,g,j,m=i.options.legend,f,l;if(m.enabled==h){return}m.enabled=h;if(!h){d.destroy.call(k);e=k.allItems;if(e){for(g=0,j=e.length;g<j;++g){e[g].legendItem=a}}k.group={}}c.render.call(i);if(!m.floating){f=i.scroller;if(f&&f.render){l=i.xAxis[0].getExtremes();f.render(l.min,l.max)}}},legendHide:function(){this.legendSetVisibility(false)},legendShow:function(){this.legendSetVisibility(true)},legendToggle:function(){this.legendSetVisibility(this.options.legend.enabled^true)}})}(Highcharts))