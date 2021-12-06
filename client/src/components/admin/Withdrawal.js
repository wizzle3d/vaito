const Withdrawal = ({ withdrawal, onClick }) => {
  let date = new Date(withdrawal.date_posted);
  return (
    <tr>
      <th scope="row text-align">{withdrawal.user.id}</th>
      <td>
        {withdrawal.user.firstname} {withdrawal.user.lastname}
      </td>
      <td>{withdrawal.user.bank_name}</td>
      <td>{withdrawal.user.bank_account_no}</td>
      <td>{withdrawal.amount}</td>
      <td>{withdrawal.status}</td>
      <td>{`${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}  ${date.getHours()}-${date.getMinutes()}`}</td>
      <td>
        <div>
          <button
            className="btn btn-danger"
            style={{ marginRight: 5 }}
            onClick={() =>
              onClick({
                ...withdrawal,
                action: "Declined",
                dispatch: "MODIFY_WITHDRAWALS",
                route: `/admin/withdrawal/${withdrawal.id}`,
                method: "PUT",
              })
            }
          >
            Decline
          </button>
          <button
            className="btn btn-success"
            onClick={() =>
              onClick({
                ...withdrawal,
                action: "Approved",
                dispatch: "MODIFY_WITHDRAWALS",
                route: `/admin/withdrawal/${withdrawal.id}`,
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

export default Withdrawal;
