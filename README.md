# urufatanamende

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

offline item looks like this:
```
Item:{
	key_1:value_1,
	key_2:value_3,
	key_3:value_3,
	created:{
		key_1:value_1,
		key_2:value_3,
		key_3:value_3
	}
	updated:{
		key_1:value_1,
		key_2:value_3,
		key_3:value_3
	}
}
```
there cannot be created and updated in the same time
if we have created, or updated it means that the item is not yet synced
