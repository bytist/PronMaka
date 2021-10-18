export interface MakaShowcaseTab {
  title: string;
  subtitle: string;
  tab: string;
  description: string;
  active: boolean;
  imageUrl: string;
  cssClasses?: string;
}

export interface MakaGraphData {
  name: string;
  series: { name: string, value: number }[];
}

export interface MakaError {
  message: string;
  errorCode: string;
}
