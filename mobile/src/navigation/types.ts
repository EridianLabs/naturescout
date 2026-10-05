export type RootStackParamList = {
  MainTabs: { screen?: keyof MainTabParamList } | undefined
  SpeciesDetail: { id: string }
  TreeDetail: { id: string }
  PlaceDetail: { id: string }
  MissionDetail: { id: string }
  Adventure: { id: string }
  AdventureGenerate: undefined
}

export type MainTabParamList = {
  DiscoverTab: undefined
  MapTab: undefined
  ExploreTab: undefined
  CollectionTab: undefined
  ProfileTab: undefined
}
