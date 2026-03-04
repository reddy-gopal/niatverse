/** Campus from GET /api/campuses/ (directory API). */
export interface CampusListItem {
  id: number;
  name: string;
  shortName: string | null;
  location: string;
  state: string;
  imageUrl: string;
  slug: string;
  isDeemed: boolean;
}
