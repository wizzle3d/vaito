import { BsImage } from "react-icons/bs";

const Cards = ({ card, onClick }) => {
  let date = new Date(card.date_posted);
  return (
    <tr>
      <th scope="row text-align">
        <a href={card.image_file} className="btn btn-primary">
          <BsImage style={{ marginBottom: 3, marginRight: 5 }} />
        </a>
      </th>
      <td>{card.id}</td>
      <td>{card.category.issuer}</td>
      <td>{card.category.card_type}</td>
      <td>{card.category.currency}</td>
      <td>{card.at_rate}</td>
      <td>{card.status}</td>
      <td>
        {`${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}  ${date.getHours()}-${date.getMinutes()}`}
      </td>
      <td>
        <div>
          <button
            className="btn btn-danger"
            style={{ marginRight: 5 }}
            onClick={() =>
              onClick({
                ...card,
                action: "Failed",
                dispatch: "MODIFY_CARDS",
                route: `/admin/card/${card.id}`,
                method: "PUT",
              })
            }
          >
            Fail
          </button>
          <button
            className="btn btn-success"
            onClick={() =>
              onClick({
                ...card,
                action: "Approved",
                dispatch: "MODIFY_CARDS",
                route: `/admin/card/${card.id}`,
                method: "PUT",
              })
            }
          >
            Approve
          </button>
        </div>
      </td>
    </tr>
  );
};

export default Cards;
