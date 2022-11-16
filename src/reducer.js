export const initialState={
    user:null,profile:[],handle:null,profilepop:false,windowstate:false,hashTrends:[],dataTrendsExplore:'',OpenTrendExplore:false,OpenComment:false
    
    
}


const reducer=(state,action)=>{
    // console.log(action)
    switch(action.type){
        
            case 'SET_USER':
             return{
                ...state,user:action.user
                 }
                
                 case 'SET_HANDLE':
             return{
                ...state,handle:action.handle
                 }
                  case 'SET_PROFILEPOP':
             return{
                ...state,profilepop:action.profilepop
                 }
                  
                
                
                case 'SET_PROFILE':
                    return{
                      ...state,profile:action.profile
                    }
                   
                    case 'SET_HASHTRENDS':
                    return{
                      ...state,hashTrends:action.hashTrends
                    }
                    case 'SET_DATATRENDSEXPLORE':
                    return{
                      ...state,dataTrendsExplore:action.hashtag
                    }
                    
                    case 'OPEN_OPENTRENDEXPLORE':
                    return{
                      ...state,OpenTrendExplore:action.OpenTrendExplore
                    }
                    

                case 'CLOSE__WINDOW':
                    return{
                      ...state,windowstate:false
                    }
                     

                case 'OPEN__WINDOW':
                    return{
                      ...state,windowstate:true
                    }
                    case 'CLOSE__COMMENT':
                    return{
                      ...state,OpenComment:false
                    }
                     

                case 'OPEN__COMMENT':
                    return{
                      ...state,OpenComment:true
                    }
                    default:return state;     
                
    }
}
export default reducer