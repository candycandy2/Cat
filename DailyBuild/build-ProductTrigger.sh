date +"%b-%d-%y"
weeks=$(date +"%U")
weekday=$(date +"%u")
month=$(date +"%m")

# remainder=$(($weeks % 2))

# if [ "$weekday" -ne 5 ]; then
#     echo "do nothing"
#     exit 0
# fi


process_release()
{
    echo "QPlayDailyBuildTrigger do release"
    java -jar jenkins-cli.jar -s http://localhost:8080/jenkins/ build QPlayProduct
}

if [[ ( "$month" == 01 ) && ( "$weeks" == 01 || "$weeks" == 03 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 02 ) && ( "$weeks" == 05 || "$weeks" == 07 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 03 ) && ( "$weeks" == 09 || "$weeks" == 11 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 04 ) && ( "$weeks" == 14 || "$weeks" == 16 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 05 ) && ( "$weeks" == 18 || "$weeks" == 20 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 06 ) && ( "$weeks" == 22 || "$weeks" == 24 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 07 ) && ( "$weeks" == 27 || "$weeks" == 29 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 08 ) && ( "$weeks" == 31 || "$weeks" == 33 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 09 ) && ( "$weeks" == 35 || "$weeks" == 37 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 10 ) && ( "$weeks" == 40 || "$weeks" == 42 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 11 ) && ( "$weeks" == 44 || "$weeks" == 46 ) ]]; then
    process_release
    exit 0
fi

if [[ ( "$month" == 12 ) && ( "$weeks" == 48 || "$weeks" == 50 ) ]]; then
    process_release
    exit 0
fi

echo "QPlayDailyBuildTrigger do nothing"
