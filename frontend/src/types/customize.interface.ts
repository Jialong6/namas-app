export interface IBead {
  bead_id: string;
  name: string;
  imgPath: string;
}

export interface IBraceletSlot {
  bead: IBead | null;
}
