import { useNavigate, useParams } from "react-router-dom";

export const WrapComps = (props)=> {
  let navigate = useNavigate();
  let params = useParams();
  let Element = props.el
  return (<Element navigate={navigate} el={Element} {...params}/>)
}
