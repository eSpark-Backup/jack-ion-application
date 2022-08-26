export function getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

export function customDropDown(props) {
    <TouchableOpacity>
              <View style={styles.dropDownContainer}>
                <MenuT
                  visible={this.state.addMenuVisible}
                  anchor={
                    <TouchableOpacity

                      style={[
                        styles.dropDown,
                        {
                          borderColor:
                            'black'
                        }
                      ]}
                      disabled={false}
                      onPress={() => this.setState({ addMenuVisible: true })}>
                      <MaterialCommunityIcons
                        name="account-details-outline"
                        size={width * 0.065}
                        color="#35afe2"
                        style={{ marginRight: width * 0.02 }}
                      />
                      <TextReuseableComponent title style={[
                        styles.dropDownText,
                        {
                          color: 'black'
                        },
                      ]} value={"Details"} />
                      <Feather
                        name="chevron-down"
                        size={height * 0.02}
                        color='black'
                        style={{ marginLeft: width * 0.02 }}
                      />
                    </TouchableOpacity>
                  }
                  onRequestClose={() =>
                    this.setState({ addMenuVisible: false })
                  }>
                  <MenuItem
                    disabled={false}>
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: width * 0.02,
                      }}>
                      {<MaterialCommunityIcons
                        name="account-details-outline"
                        size={width * 0.065}
                        color="#35afe2"
                        style={{ marginRight: width * 0.02 }}
                      />}
                      <TextReuseableComponent title value={"Item Name"} />
                    </View>
                  </MenuItem>
                </MenuT>
              </View>
            </TouchableOpacity>
}