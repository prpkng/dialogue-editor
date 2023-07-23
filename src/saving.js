export default function saveAsObject(data){
    var obj = {}
    
    for (var el of data){
        obj[el.key] = el.value
    }
    return obj
}
