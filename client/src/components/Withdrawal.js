import { BsCheckCircleFill, BsXSquareFill } from "react-icons/bs";

const Withdrawal = ({ wtdl }) => {
  let date = new Date(wtdl && wtdl.date_posted);
  return (
    <tr>
      <th scope="row">{wtdl?.amount}</th>
      <td>
        {wtdl.status === "Approved" && (
          <BsCheckCircleFill style={{ color: "green" }} />
        )}
        {wtdl.status === "Declined" && (
          <BsXSquareFill style={{ color: "red", marginRight: 5 }} />
        )}
        {wtdl.status === "Pending" && wtdl.status}
      </td>
      <td>
        {`${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}  ${date.getHours()}-${date.getMinutes()}`}
      </td>
    </tr>
  );
};

export default Withdrawal;
