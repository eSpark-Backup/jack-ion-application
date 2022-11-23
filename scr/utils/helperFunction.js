import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage, hideMessage } from "react-native-flash-message";
import navigationService from '../../navigationService';

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

export function pushNotification(notification) {
  const data = notification?.data?.id ? JSON.parse(notification?.data?.id) : null;
  const regex = /\d+/g;
  const matches = notification?.message ? notification?.message.match(regex) : null;  // creates array from matches
  const idInNumber = matches ? Number(matches[0]) : null;
  const id = data ? data?.property?.id || data?.id : idInNumber;

  return showMessage({
    message: notification?.title,
    description: notification?.userInteraction ? notification?.message : `${notification?.title || notification?.notification?.title} with id ${ id }`,
    type: "info",
    color: "white", // text color
    onPress: () => {
      /* THIS FUNC/CB WILL BE CALLED AFTER MESSAGE PRESS */
      hideMessage();
      if (notification?.message?.includes('unit')) {
          navigationService.navigate("Equip", { item: { item: data.property } })
        } else {
          navigationService.navigate("Detail", { item: { item: data } })
        }
    },
  });
}

export async function addToRecent(item) {
  const userDataUnParsed = await AsyncStorage.getItem('users_data');
  const userId = await AsyncStorage.getItem('user_id');
  const userData = JSON.parse(userDataUnParsed);
  let index = userData
    .map((e) => {
      return e.id;
    })
    .indexOf(Number(userId));
  let ids = [...userData[index].recent_properties];
  let found = ids.includes(item.id);
  if (!found) {
    if (ids.length > 9) {
      ids.shift();
    }
    ids.push(item.id);
    const userDataUpdated = [...userData];
    userDataUpdated[index].recent_properties = ids;
    const jsonData = JSON.stringify(userDataUpdated);
    await AsyncStorage.setItem('users_data', jsonData);
  }
}

export function customSort(data, order) {
  function isNumber(v) {
    return (+v).toString() === v;
  }
  var sort = {
    asc: function (a, b) {
      var i = 0,
        l = Math.min(a.value.length, b.value.length);

      while (i < l && a.value[i] === b.value[i]) {
        i++;
      }
      if (i === l) {
        return a.value.length - b.value.length;
      }
      if (isNumber(a.value[i]) && isNumber(b.value[i])) {
        return a.value[i] - b.value[i];
      }
      return a.value[i].localeCompare(b.value[i]);
    },
    desc: function (a, b) {
      return sort.asc(b, a);
    },
  },
    mapped = data.map(function ({ name }, i) {
      var string = name.replace(/\d(?=[a-z])|[a-z](?=\.)/gi, '$&. .'),
        string = name.replace(/\s/g, ''),
        regex = /(\d+)|([^0-9.]+)/g,
        m,
        parts = [];
      while ((m = regex.exec(string)) !== null) {
        parts.push(m[0]);
      }
      return { index: i, value: parts, o: name, string: string };
    });
  mapped.sort(sort[order] || sort.asc);
  return mapped.map(function (el) {
    return data[el.index];
  });

}