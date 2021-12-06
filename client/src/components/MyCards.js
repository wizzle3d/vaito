import { BsImage, BsCheckCircleFill, BsXSquareFill } from "react-icons/bs";

const MyCards = ({ card }) => {
  let date = new Date(card.date_posted);
  return (
    <tr>
      <th scope="row">
        <a href={card.image_file} className="btn btn-primary">
          <BsImage style={{ marginBottom: 3 }} />
        </a>
      </th>
      <td>{card.category.issuer}</td>
      <td>{card.amount}</td>
      <td>{card.category.currency}</td>
      <td>{card.at_rate}</td>
      <td>
        {card.status === "Approved" && (
          <BsCheckCircleFill style={{ color: "green" }} />
        )}
        {card.status === "Failed" && (
          <BsXSquareFill style={{ color: "red", marginRight: 5 }} />
        )}
        {card.status === "Pending" && card.status}
      </td>
      <td>
        {`${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}  ${date.getHours()}-${date.getMinutes()}`}
      </td>
    </tr>
  );
};

export default MyCards;
