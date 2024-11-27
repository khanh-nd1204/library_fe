import {PropsWithChildren} from "react";

const ClientLayout = (props: PropsWithChildren) => {
  return (
    <>
      {props.children}
    </>
  )
}

export default ClientLayout