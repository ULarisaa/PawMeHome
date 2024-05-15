case 'history':
      
               
                
                const eventsForSectionList = [
                  { title: "Upcoming Events", data: futureEvents },
                  { title: "Past Events", data: pastEvents },
                ];
                const filteredEvents = eventsForSectionList.map(section => ({
                  ...section,
                  data: section.data.filter(item => 
                    (item.titleofevent ? item.titleofevent.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
                    (item.details ? item.details.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
                    (item.typeofevent ? item.typeofevent.toLowerCase().includes(searchQuery.toLowerCase()) : false)
                  )
                }));
                
                
                return (
                  <View style={{ flex: 1 }}>
                  <View style={styles.searchSection}>
                      <Icon style={styles.searchIcon} name="search" size={20} color="#000"/>
                      <TextInput
                        style={styles.Searchinput}
                        placeholder="Search"
                        underlineColorAndroid="transparent"
                        onChangeText={handleSearch}
                      />
                    </View>

                    <SectionList
  sections={filteredEvents}
  keyExtractor={(item) => item.eventid.toString()}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
      
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Icon
                  name="calendar-today"
                  type="material"
                  color={primary}
                  size={16}
                />
                <Text style={styles.eventDateList}>
                  {' '}{new Date(item.eventdate).toLocaleDateString()}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Icon
                  name="access-time"
                  type="material"
                  color={primary}
                  size={16}
                />
                <Text style={styles.eventDateList}>
                        {' '}{new Date(item.eventdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    </View>

            </View>
            <Text style={styles.eventType}>{item.typeofevent === 'custom' ? item.titleofevent : item.typeofevent}</Text>
            <Text style={styles.eventDetails}>{item.details}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />

                  </View>
                );