import Api from '../Api';
import { RoomMetadataObjectInterface } from '../Interfaces/RoomMetadataInterface';

const RoomService = {
    getRooms: () => Api.get<RoomMetadataObjectInterface>("rooms"),
};

export default RoomService;

