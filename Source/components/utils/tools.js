 
// 深拷贝对象 
export const copyobj = (obj1,obj2) =>{
  let obj = obj2||{};
  for(let name in obj1){
    if(typeof obj1[name] ==="object"){
      obj[name] = (obj1[name].constructor === Array)?[]:{};
      copy(obj1[name],obj[name]);
    }else{
      obj[name] = obj1[name];
    }
  }
  return obj;
}
