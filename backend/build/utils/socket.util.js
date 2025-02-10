import { userSocketIds } from "../index.js";
export const emitEvent = ({ data, event, io, users }) => {
    io.to(getMemberSockets(users)).emit(event, data);
};
export const emitEventToRoom = ({ data, event, io, room }) => {
    io.to(room).emit(event, data);
};
export const getOtherMembers = ({ members, user }) => {
    return members.filter(member => member !== user);
};
export const getMemberSockets = (members) => {
    return members.map(member => userSocketIds.get(member));
};
